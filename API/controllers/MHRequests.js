const fs = require("fs");
const path = require("path");

const { getClave } = require("../utils/getClave");
const connection = require("../config/db");
const axios = require("axios");
const firmarXml = require("../utils/FirmadorDos");
const { createXML } = require("../utils/createXML");
const { sendInvoiceByEmail } = require("./auth");
const { generarFacturaPDF } = require("../utils/createPDF");

/** Obtener token */
async function getToken(company_id) {
  console.log("company id ", company_id);
  return new Promise((resolve, reject) => {
    const selectQuery =
      "SELECT * FROM company_credentials WHERE company_id = ?";
    connection.query(selectQuery, [company_id], async (err, results) => {
      if (err) {
        console.error("Error al obtener las credenciales:", err);
        return reject(new Error("Error interno del servidor"));
      }

      if (results.length === 0) {
        return reject(
          new Error(
            "Credenciales no encontradas para el company_id proporcionado"
          )
        );
      }

      const credentials = results[0];

      try {
        const response = await axios.post(
          "https://idp.comprobanteselectronicos.go.cr/auth/realms/rut-stag/protocol/openid-connect/token",
          new URLSearchParams({
            client_id: credentials.client_id,
            username: credentials.usuario,
            password: credentials.password,
            grant_type: "password",
          }).toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const token = response.data.access_token;
        resolve(token);
      } catch (error) {
        console.error("Error al solicitar el token:", error);
        reject(new Error("Error al solicitar el token"));
      }
    });
  });
}

const getCompanyData = (companyId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
      SELECT 
        *
      FROM 
        company_address_view
      WHERE 
        status = 'ACTIVE'
        AND id = ?`,
      [companyId],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        if (results.length === 0) {
          return reject(new Error("Company not found"));
        }

        // Transformar los resultados a un nuevo formato
        const result = results[0];
        const Emisor = {
          company_id: result.id,
          actividadComercial: result.economic_activity,
          nombre: result.name,
          tipoDeIdentificacion: result.identification_type,
          identificacion: result.identification_number,
          NombreComercial: result.trade_name,
          Provincia: result.province,
          Canton: result.canton,
          Distrito: result.district,
          direccionExacta: result.exact_address,
          codigoTelefono: result.country_code,
          Telefono: result.phone,
          correo: result.email,
        };

        resolve(Emisor);
      }
    );
  });
};

async function createInvoice2(req, res) {
  try {
    const invoiceData = extractInvoiceData(req.body);
    const companyData = await getCompanyData(invoiceData.company_id);
    const invoiceKeyData = await generateInvoiceKey(companyData);
    const xmlData = prepareXMLData(companyData, invoiceData, invoiceKeyData);
    const signedXml = await signXML(xmlData);
    const response = await sendInvoiceToHacienda(
      signedXml,
      companyData,
      invoiceData
    );
    await sendInvoiceByEmail(invoiceData, signedXml);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error en la creación de la factura:", error);
    res.status(500).json({ error: error.message });
  }
}

function saveXMLToFile(xmlString, filename) {
  // Define el directorio donde deseas guardar los archivos XML
  // Puede ser un directorio relativo a tu proyecto o una ruta absoluta
  const directoryPath = path.join(__dirname, "./");

  // Si el directorio no existe, créalo
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  const filePath = path.join(directoryPath, filename);

  // Escribe el XML en el archivo
  fs.writeFile(filePath, xmlString, (err) => {
    if (err) {
      console.error("Error al guardar el archivo XML:", err);
      throw err; // O manejar el error de la manera que prefieras
    }
    console.log(`El archivo XML ha sido guardado en: ${filePath}`);
  });
}

// Función para enviar la factura a Hacienda
const enviarFacturaHacienda = async (
  data,
  companyId,
  signedXml,
  signedXmlPath
) => {
  const token = await getToken(companyId);
  try {
    const xmlBase64 = Buffer.from(signedXml).toString("base64");
    const jsonBody = {
      clave: data.KeyXml,
      fecha: data.Fecha,
      emisor: {
        tipoIdentificacion: data.Emisor.tipoDeIdentificacion,
        numeroIdentificacion: data.Emisor.identificacion,
      },
      receptor: {
        tipoIdentificacion: data.Cliente.tipoIdentificacion,
        numeroIdentificacion: data.Cliente.identificacion,
      },
      comprobanteXml: xmlBase64,
    };
    const response = await axios.post(
      "https://api-sandbox.comprobanteselectronicos.go.cr/recepcion/v1/recepcion/",
      jsonBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Aquí manejas la respuesta de la API de Hacienda
    if (response.status === 202) {
      // Factura enviada con éxito
      console.log("factura enviada con exito");
      await generarFacturaPDF(data);
      sendInvoiceByEmail(
        data.Emisor.NombreComercial,
        data.Cliente.email,
        data.Cliente.nombre,
        signedXmlPath,
        signedXmlPath,
        signedXmlPath
      );
      // guardar en bd
    } else {
      // Manejar respuestas inesperadas
      console.log(response);
      throw new Error(
        "Respuesta inesperada de la API",
        response.x - error - cause
      );
    }
  } catch (error) {
    console.error(
      "Error al enviar la factura:",
      error.response.headers.status,
      error.response.headers.statusText
    );
    return error;
    //throw error;
  }
};

const createInvoice = async (req, res) => {
  try {
    const invoiceData = req.body;
    const companyData = await getCompanyData(invoiceData.company_id);
    const invoiceKeyData = await generateInvoiceKey(companyData, "FE");
    const xmlData = prepareXMLData(companyData, invoiceData, invoiceKeyData);

    const xml = createXML(xmlData);

    const xmlFilename = `factura${invoiceKeyData.consecutivo}.xml`; // El nombre del archivo que deseas guardar
    saveXMLToFile(xml, xmlFilename);

    const xmlInputPath = path.join(__dirname, "..", "files", "factura.xml");
    const xmlOutputPath = path.join(
      __dirname,
      "..",
      "files",
      `xmlFirmado${invoiceKeyData.consecutivo}.xml`
    );
    const pfxPath = path.join(__dirname, "..", "files", "011693011422.p12");
    // Guarda temporalmente el XML antes de firmarlo
    fs.writeFileSync(xmlInputPath, xml, "utf8");
    // Firma el XML
    console.log("todo bien aca ");
    try {
      firmarXml(pfxPath, "5050", xmlInputPath, xmlOutputPath);
    } catch (error) {
      console.error("Error al firmar el XML:", error);
      return res
        .status(500)
        .json({ error: "Error interno del servidor al firmar la factura" });
    }
    // Leer el XML firmado
    const signedXml = fs.readFileSync(xmlOutputPath, "utf8");
    const response = enviarFacturaHacienda(
      xmlData,
      invoiceData.company_id,
      signedXml,
      xmlOutputPath
    );

    res.status(200).json(response);
  } catch (error) {
    console.error("Error en la creación de la factura:");
    res.status(500).json({ error: error.message });
  }
};

function generateRandomNumberString(length) {
  let result = "";
  const characters = "0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const getCurrentConsecutiveByCompany = (IDCompania) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        ConsecutivoActual
      FROM 
        consecutivosfactura
      WHERE 
        IDCompania = ?
    `;

    connection.query(query, [IDCompania], (error, results) => {
      if (error) {
        return reject(error);
      }

      if (results.length === 0) {
        return reject(
          new Error(
            "No se encontró el consecutivo para la compañía especificada"
          )
        );
      }

      const consecutivoActual = results[0].ConsecutivoActual;
      resolve(consecutivoActual);
    });
  });
};

const generateInvoiceKey = async (companyData, documentType) => {
  const codigoSeguridadAleatorio = generateRandomNumberString(8);
  const consecutivoActual = await getCurrentConsecutiveByCompany(
    companyData.company_id
  );
  const { clave, consecutivo } = getClave(
    documentType, // Este valor podría ser estático o basado en alguna lógica
    companyData.tipoDeIdentificacion,
    companyData.identificacion,
    "normal", // Este valor podría ser estático o basado en alguna lógica
    companyData.codigoTelefono,
    consecutivoActual,
    codigoSeguridadAleatorio
  );
  return { clave, consecutivo };
};

function prepareXMLData(companyData, invoiceData, invoiceKeyData) {
  let fechaActual = new Date();
  let fechaISO = fechaActual.toISOString();

  return {
    Emisor: companyData,
    Cliente: invoiceData.Cliente,
    CodigoActividad: "552004", // jalar de algun lao
    headDocument: "FacturaElectronica",
    footerDocument: "FacturaElectronica",
    KeyXml: invoiceKeyData.clave,
    Consecutivo: invoiceKeyData.consecutivo,
    Fecha: fechaISO,
    CondicionDeVenta: invoiceData.CondicionDeVenta,
    MedioDePago: invoiceData.MedioDePago,
    LineaDeDetalle: invoiceData.LineaDeDetalle,
    OtrosCargos: invoiceData.OtrosCargos,
    // Puedes agregar más campos aquí según lo necesites
  };
}

module.exports = { createInvoice };
