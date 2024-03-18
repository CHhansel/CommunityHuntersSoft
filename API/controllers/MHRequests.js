const fs = require("fs");
const path = require("path");
const pool = require("../config/db2");
const { getClave } = require("../utils/getClave");
const connection = require("../config/db");
const axios = require("axios");
const firmarXml = require("../utils/FirmadorDos");
const { createXML } = require("../utils/createXML");
const { sendInvoiceByEmail } = require("./auth");
const { generarFacturaPDF } = require("../utils/createPDF");
const { log } = require("console");

/** Obtener token */
async function getToken(company_id) {
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
function saveXMLToFileInPath(xmlString, filename, directory) {
  // Usa el directorio proporcionado o un directorio por defecto
  const directoryPath = directory || path.join(__dirname, "./");

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
  });
  return filePath; // Retorna la ruta completa del archivo
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
  });
}

// Función para enviar la factura a Hacienda
const enviarFacturaHacienda = async (
  data,
  companyId,
  signedXml,
  signedXmlPath,
  dgtPath,
  pdfFilePath
) => {
  const token = await getToken(companyId);
  // aca es valido
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
      // Esperar 5 segundos
      // esperar 2 sec pedirla, si retorna procesando, 5 veces
      await new Promise((resolve) => setTimeout(resolve, 4000));
      const respuestaConsulta = await verificarRecepcionFactura(
        data.KeyXml,
        token
      );
      const base64Xml = respuestaConsulta["respuesta-xml"]; // Reemplaza con tu variable adecuada
      const xmlString = Buffer.from(base64Xml, "base64").toString("utf8");
      const comprobantePath = saveXMLToFileInPath(
        xmlString,
        `comprobante-${data.KeyXml}.xml`,
        dgtPath
      );
      // Llamada a tu función para guardar el XML en un archivo
      const pdfPath = await generarFacturaPDF(data, pdfFilePath);
      sendInvoiceByEmail(
        data.Emisor.NombreComercial,
        data.Cliente.email,
        data.Cliente.nombre,
        signedXmlPath,
        pdfPath,
        comprobantePath
      );
      // guardar en bd
      //Insertar la factura en la base de datos

      await insertarFacturaEnBD(
        data, // Aquí asumimos que 'data' tiene la estructura correcta para 'datosFactura'
        companyId // El ID de la compañía
      );
      return pdfPath;
    } else {
      // Manejar respuestas inesperadas
      throw new Error(
        "Respuesta inesperada de la API",
        response.x - error - cause
      );
    }
  } catch (error) {
    console.error("Error al enviar la factura:", error);
    return error;
    //throw error;
  }
};

const createInvoice = async (req, res) => {
  try {
    const invoiceData = req.body;
    console.log(invoiceData);
    // Determinar el tipo de documento
    let headDocument, footerDocument;

    let typeDocument = "FE";
    switch (invoiceData.facturaElectronica) {
      case "01":
        typeDocument = "FE";
        headDocument =
          'FacturaElectronica xmlns="https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/facturaElectronica" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
        footerDocument = "FacturaElectronica";
        break;
      case "02":
        typeDocument = "ND";
        headDocument =
          'NotaDebitoElectronica xmlns="https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/notaDebitoElectronica" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
        footerDocument = "NotaDebitoElectronica";
        break;
      case "03":
        typeDocument = "NC";
        headDocument =
          'NotaCreditoElectronica xmlns="https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/notaCreditoElectronica" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
        footerDocument = "NotaCreditoElectronica";
        break;
      case "04":
        typeDocument = "TE";
        headDocument =
          'TiqueteElectronico xmlns="https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/tiqueteElectronico" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
        footerDocument = "TiqueteElectronico";
        break;
    }
    const companyData = await getCompanyData(invoiceData.company_id);

    const invoiceKeyData = await generateInvoiceKey(companyData, typeDocument);

    const xmlData = prepareXMLData(companyData, invoiceData, invoiceKeyData, headDocument, footerDocument);
    // Crear la ruta para los directorios
    const dateFolder = formatDate(new Date()); // Asumiendo que invoiceData tiene un campo de fecha
    const routeFiles = path.join(
      __dirname,
      "..",
      "fileSystem",
      `Comprobantes-${typeDocument}`,
      dateFolder
    );
    console.log("aca ok----------------- 1");
    const pdfPath = createDirectoryIfNotExist(
      path.join(routeFiles, `PDF-${typeDocument}`)
    );
    const dgtPath = createDirectoryIfNotExist(path.join(routeFiles, "XML-DGT"));
    const XMLsigned = createDirectoryIfNotExist(
      path.join(routeFiles, "XML-Firmado")
    );

    const xml = createXML(xmlData);
    const xmlFilename = `factura${invoiceKeyData.consecutivo}.xml`; // El nombre del archivo que deseas guardar
    saveXMLToFile(xml, xmlFilename);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const xmlInputPath = path.join(__dirname, "..", "files", "factura.xml");
    const xmlOutputPath = path.join(
      XMLsigned,
      `xmlFirmado${invoiceKeyData.consecutivo}.xml`
    );

    const pfxPath = path.join(__dirname, "..", "files", "011693011422.p12");
    // Guarda temporalmente el XML antes de firmarlo
    fs.writeFileSync(xmlInputPath, xml, "utf8");
    // Firma el XML
    try {
      firmarXml(pfxPath, "5050", xmlInputPath, xmlOutputPath);
    } catch (error) {
      console.error("Error al firmar el XML:", error);
      return res
        .status(500)
        .json({ error: "Error interno del servidor al firmar la factura" });
    }
    // Leer el XML firmado
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const signedXml = fs.readFileSync(xmlOutputPath, "utf8");

    const response = await enviarFacturaHacienda(
      xmlData,
      invoiceData.company_id,
      signedXml,
      xmlOutputPath,
      dgtPath,
      pdfPath
    );

    // En lugar de devolver JSON, devolvemos el archivo PDF
    // Asegúrate de que pdfPath es la ruta absoluta al archivo PDF que quieres enviar

    // Asegurarse de que el archivo existe antes de intentar enviarlo
    if (await fs.existsSync(response)) {
      return res.sendFile(response, (err) => {
        if (err) {
          console.error("Error al enviar el archivo PDF:", err);
          return res.status(500).send("Error al enviar el archivo PDF.");
        }
      });
    } else {
      throw new Error("El archivo PDF no se encontró.");
    }
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
async function verificarRecepcionFactura(keyXml, token) {
  try {
    const consultaUrl = `https://api-sandbox.comprobanteselectronicos.go.cr/recepcion/v1/recepcion/${keyXml}`;
    const consultaResponse = await axios.get(consultaUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Devolver la respuesta completa de la consulta
    return consultaResponse.data;
  } catch (error) {
    console.error("Error al realizar la consulta:", error);
    return null;
  }
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

function prepareXMLData(companyData, invoiceData, invoiceKeyData,headDocument, footerDocument) {
  let fechaActual = new Date();
  let fechaISO = fechaActual.toISOString();

  return {
    Emisor: companyData,
    Cliente: invoiceData.Cliente,
    CodigoActividad: "552004", // jalar de algun lao
    headDocument: headDocument,
    footerDocument: footerDocument,
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
function calcularTotales(lineaDeDetalle) {
  let totalServGravados = 0;
  let totalMercanciasGravadas = 0;
  let totalGravado = 0;
  let totalVenta = 0;
  let totalImpuesto = 0;

  lineaDeDetalle.forEach((item) => {
    const precioSinImpuesto = item.tax_included
      ? item.price / (1 + item.tax_rate / 100)
      : item.price;
    const impuesto = item.tax_included
      ? item.price - precioSinImpuesto
      : (item.price * item.tax_rate) / 100;
    const montoTotal = item.price * item.quantity;
    const montoTotalSinImpuesto = precioSinImpuesto * item.quantity;

    // Asumiendo que todo es mercancía para este ejemplo, si tienes servicios, necesitarás clasificarlos aquí
    totalMercanciasGravadas += montoTotalSinImpuesto;

    totalVenta += montoTotalSinImpuesto;
    totalImpuesto += impuesto * item.quantity;
  });

  totalGravado = totalMercanciasGravadas; // Si también hay servicios gravados, sumarlos aquí
  const totalVentaNeta = totalVenta;
  const totalComprobante = totalVenta + totalImpuesto; // Aquí deberías agregar otros cargos si existen

  return {
    TotalServGravados: totalServGravados.toFixed(2), // Redondeo a dos decimales
    TotalMercanciasGravadas: totalMercanciasGravadas.toFixed(2),
    TotalGravado: totalGravado.toFixed(2),
    TotalVenta: totalVenta.toFixed(2),
    TotalVentaNeta: totalVentaNeta.toFixed(2),
    TotalImpuesto: totalImpuesto.toFixed(2),
    TotalComprobante: totalComprobante.toFixed(2),
  };
}
function transformarDatosParaProcedimiento(jsonInput) {
  // Extraer y transformar los datos del emisor
  const datosEmisor = {
    Nombre: jsonInput.Emisor.nombre,
    TipoIdentificacion: jsonInput.Emisor.tipoDeIdentificacion,
    NumeroIdentificacion: jsonInput.Emisor.identificacion,
    NombreComercial: jsonInput.Emisor.NombreComercial,
    Provincia: jsonInput.Emisor.Provincia,
    Canton: jsonInput.Emisor.Canton,
    Distrito: jsonInput.Emisor.Distrito,
    OtrasSenas: jsonInput.Emisor.direccionExacta,
    CodigoPais: jsonInput.Emisor.codigoTelefono,
    NumTelefono: jsonInput.Emisor.Telefono,
    CorreoElectronico: jsonInput.Emisor.correo,
  };

  // Extraer y transformar los datos del receptor
  const datosReceptor = {
    Nombre: jsonInput.Cliente.nombre,
    TipoIdentificacion: jsonInput.Cliente.tipoIdentificacion,
    NumeroIdentificacion: jsonInput.Cliente.identificacion,
    CorreoElectronico: jsonInput.Cliente.email,
  };

  // Extraer y transformar los datos de la factura
  const totales = calcularTotales(jsonInput.LineaDeDetalle);
  const datosFactura = {
    Clave: jsonInput.KeyXml,
    CodigoActividad: jsonInput.CodigoActividad,
    NumeroConsecutivo: jsonInput.Consecutivo,
    FechaEmision: convertirFechaISOaMySQL(jsonInput.Fecha),
    CondicionVenta: jsonInput.CondicionDeVenta,
    MedioPago: jsonInput.MedioDePago,
    TotalServGravados: totales.TotalServGravados,
    TotalMercanciasGravadas: totales.TotalMercanciasGravadas,
    TotalGravado: totales.TotalGravado, // Debes calcular esto basado en tus LineaDeDetalle
    TotalVenta: totales.TotalVenta, // Debes calcular esto basado en tus LineaDeDetalle
    TotalVentaNeta: totales.TotalVentaNeta, // Debes calcular esto basado en tus LineaDeDetalle
    TotalImpuesto: totales.TotalImpuesto, // Debes calcular esto basado en tus LineaDeDetalle
    TotalOtrosCargos: jsonInput.OtrosCargos || 0, // Poner un valor por defecto si es undefined
    TotalComprobante: totales.TotalComprobante, // Debes calcular esto basado en tus LineaDeDetalle
  };

  // Transformar los detalles de la factura
  const detallesFactura = jsonInput.LineaDeDetalle.map((item, index) => ({
    NumeroLinea: index + 1,
    Codigo: item.internal_code,
    TipoCodigoComercial: item.product_type, // Asumiendo que esta es la correcta correspondencia
    CodigoComercial: item.cabys_code,
    Cantidad: item.quantityInOrder,
    UnidadMedida: item.unit_of_measure,
    Descripcion: item.description,
    PrecioUnitario: item.price,
    MontoTotal: item.price * item.quantityInOrder,
    SubTotal: item.price * item.quantityInOrder, // Asumiendo que no hay descuentos
    MontoTotalLinea:
      item.price * item.quantityInOrder * (1 + item.tax_rate / 100), // Incluyendo impuesto
    Impuesto: {
      // Asumiendo que cada línea solo tiene un tipo de impuesto
      Codigo: "01", // El código de impuesto, necesitarás ajustar esto según tu lógica de negocio
      CodigoTarifa: "08", // La tarifa de impuesto, necesitarás ajustar esto según tu lógica de negocio
      Tarifa: item.tax_rate,
      Monto: item.price * item.quantityInOrder * (item.tax_rate / 100),
    },
  }));

  // Debes calcular los totales de la factura aquí
  // ...

  // Extraer el company_id como idCompania
  const idCompania = jsonInput.Emisor.company_id;

  return {
    datosFactura,
    detallesFactura,
    datosEmisor,
    datosReceptor,
    idCompania,
  };
}
async function insertarFacturaEnBD(datosFactura, idCompania) {
  try {
    // Transformar los datos para el procedimiento almacenado
    const datosTransformados = transformarDatosParaProcedimiento(datosFactura);
    // Llamar al procedimiento almacenado 'CrearFacturaCompleta'
    console.log(
      "----------------------------------------------------------------------------"
    );
    await pool.query("CALL CrearFacturaCompleta(?, ?, ?, ?, ?)", [
      JSON.stringify(datosTransformados.datosFactura),
      JSON.stringify(datosTransformados.detallesFactura),
      JSON.stringify(datosTransformados.datosEmisor),
      JSON.stringify(datosTransformados.datosReceptor),
      idCompania,
    ]);
    return true;
  } catch (error) {
    console.error("Error al insertar la factura en la BD:", error);
    throw error;
  }
}
function convertirFechaISOaMySQL(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toISOString().slice(0, 19).replace("T", " ");
}

function createDirectoryIfNotExist(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir; // Retorna la ruta del directorio
}

// Función para formatear fechas
function formatDate(date) {
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}
module.exports = { createInvoice };
