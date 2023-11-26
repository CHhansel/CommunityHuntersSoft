const fs = require("fs");
const path = require("path");
const Firmador = require("../utils/firmador");
const { generateXML } = require("../utils/genXML");
const { getClave } = require("../utils/getClave");
const connection = require("../config/db");




async function getToken(company_id) {
  return new Promise((resolve, reject) => {
      const selectQuery = "SELECT * FROM company_credentials WHERE company_id = ?";
      connection.query(selectQuery, [company_id], async (err, results) => {
          if (err) {
              console.error("Error al obtener las credenciales:", err);
              return reject(new Error("Error interno del servidor"));
          }

          if (results.length === 0) {
              return reject(new Error("Credenciales no encontradas para el company_id proporcionado"));
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
              console.log("token es",token);
              resolve(token);
          } catch (error) {
              console.error("Error al solicitar el token:", error);
              reject(new Error("Error al solicitar el token"));
          }
      });
  });
  
}



const createInvoice = async (req, res) => {
  const { company_id, invoiceDetails } = req.body;
  const paymentDetails = invoiceDetails.paymentDetails;
  const clientData = invoiceDetails.clientData;
  const propertyData = invoiceDetails.property;
  //const token = getToken(company_id);
  try {
    // Obtener los datos de la compañía
    const companyData = await getCompanyData(company_id);
    console.log(companyData);
    // Generar clave y consecutivo
    const { clave, consecutivo } = getClave(
      "FE",
      "01",
      companyData.identification_number,
      "normal",
      "506",
      "123123",
      "132"
    );

    // Preparar datos para la generación del XML
    // const xmlData = {
    //   ...invoiceDetails,
    //   KeyXml: clave,
    //   Consecutive: consecutivoFinal,
    //   DataEmisor: [companyData]
    // };
    const data = {
      headDocument: "FacturaElectronica",
      footerDocument: "FacturaElectronica",
      KeyXml: clave, // La clave debería generarse según las especificaciones requeridas
      DataEmisor: [
        {
          CodeActivity: companyData.economic_activity || "", // Ejemplo de campo opcional
          Name: companyData.name,
          TypeIdentification: companyData.identification_type,
          IdentificationNumber: companyData.identification_number,
          TradeName: companyData.trade_name || "", // Ejemplo de campo opcional
          Province: "", // Estos detalles de ubicación podrían necesitar ser añadidos
          Canton: "",
          District: "",
          Address: "",
          CodePhone: "", // Deberás agregar el código de país si es necesario
          Phone: companyData.phone,
          Email: companyData.email,
        },
      ],
      Consecutive: consecutivo, // El consecutivo también debería generarse según las especificaciones requeridas
      DateDocument: paymentDetails.issueDate,
      DocumentHead: [
        {
          TypeIdentification: clientData.dniType || "",
          IdentificationNumber: clientData.customerDni || "",
          NameClient: `${clientData.name} ${clientData.lastname}`,
          Email: clientData.email || "",
          TypePayment: paymentDetails.paymentMethod,
          TotalServGravados: propertyData.taxAmount,
          TotalMercanciasGravadas: propertyData.rentAmount,
          TotalGravado: "", // Calcular si es necesario
          TotalVenta: propertyData.totalAmount,
          TotalVentaNeta: "", // Calcular si es necesario
          TotalImpuesto: propertyData.taxAmount,
          TotalOtrosCargos: "", // Añadir si hay otros cargos
          TotalComprobante: propertyData.totalAmount + propertyData.taxAmount, // Asumiendo que es la suma del total más impuestos
        },
      ],
      DocumentDetail: [
        {
          // Detalles de la propiedad, se pueden replicar para múltiples ítems
          Code: "001", // Este debe ser un código que identifique la propiedad o el servicio
          CodeReference: "A001", // Un código de referencia para la propiedad o servicio
          Quantity: "1", // Cantidad de servicios/productos, en este caso podría ser '1' por ser una propiedad
          UnidMeasure: "Unid", // La unidad de medida, 'Unid' para 'unidad' es común para servicios
          ProductDescription: propertyData.description,
          Price: propertyData.rentAmount,
          SubTotal: propertyData.totalAmount, // Sin impuestos
          Discount: "0", // Asumiendo que no hay descuento
          DetailDiscount: "",
          Impuesto: propertyData.taxAmount,
          MontoTotalLinea: propertyData.totalAmount + propertyData.taxAmount, // Total incluyendo impuestos
        },
      ],
    };
    // Generar XML
    const xml = generateXML(data);

    const xmlFilename = "factura.xml"; // El nombre del archivo que deseas guardar
    saveXMLToFile(xml, xmlFilename);
    
   
    const xmlInputPath = path.join(__dirname, '..', 'files', 'factura.xml');
    const xmlOutputPath = path.join(__dirname, '..', 'files', `xmlFirmado${consecutivo}.xml`);
    const pfxPath = path.join(__dirname, '..', 'files', '011693011422.p12');
    // Guarda temporalmente el XML antes de firmarlo
    fs.writeFileSync(xmlInputPath, xml, "utf8");
    // Firma el XML
    try {
      Firmador.firmarXml(pfxPath, '5050', xmlInputPath, xmlOutputPath);
    } catch (error) {
      console.error("Error al firmar el XML:", error);
      return res
        .status(500)
        .json({ error: "Error interno del servidor al firmar la factura" });
    }
    // Leer el XML firmado
    const signedXml = fs.readFileSync(xmlOutputPath, "utf8");
    enviarFacturaHacienda(data,company_id,signedXml)
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error en la creación de la factura:", error);
    res.status(500).json({ error: error.message, data });
  }
};

const getCompanyData = (companyId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
      SELECT 
        name, legal_name, trade_name, identification_type, 
        identification_number, phone, email, economic_activity, tax_regime
      FROM 
        company
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
        resolve(results[0]);
      }
    );
  });
};
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
const enviarFacturaHacienda = async (data,companyId, signedXml) => {
  const token = getToken(companyId);
  console.log("datos de data en enviarFactura");
  console.log(data);
  try {
    const xmlBase64 = Buffer.from(signedXml).toString('base64');
    const jsonBody = {
      // clave: ..., 
      // fecha: ..., 
      // emisor: ...,
      // receptor: ..., 
      comprobanteXml: xmlBase64,
    };
    const response = await axios.post(
      'https://api.comprobanteselectronicos.go.cr/recepcion/v1/recepcion',
      jsonBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    // Aquí manejas la respuesta de la API de Hacienda
    if (response.status === 201) {
      // Factura enviada con éxito
      return response.headers.location;
    } else {
      // Manejar respuestas inesperadas
      throw new Error('Respuesta inesperada de la API');
    }
  } catch (error) {
    console.error('Error al enviar la factura:', error);
    throw error;
  }
}
module.exports = { createInvoice };
