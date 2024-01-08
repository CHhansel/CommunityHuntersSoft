const puppeteer = require("puppeteer");
const pug = require("pug");
const fs = require("fs");
const path = require("path");
const { getInvoiceParameters } = require("../controllers/company");

const generarFacturaPDF = async (datosFactura, outputDirectory) => {
  // Leer el contenido del archivo CSS
  const cssContent = fs.readFileSync(
    path.join(__dirname, "./BillTemplates", "Billstyles.css"),
    "utf8"
  );

  // Compilar la plantilla Pug con el contenido del CSS
  const compiledPug = pug.compileFile(
    path.join(__dirname, "./BillTemplates", "bill.pug")
  );
  const invoiceParams = await getInvoiceParameters(
    datosFactura.Emisor.company_id
  );
  const completeData = { ...datosFactura, ...invoiceParams };

  const fechaObjeto = new Date(datosFactura.Fecha);
  const opciones = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  completeData.Fecha = fechaObjeto.toLocaleDateString("es", opciones);
  // Calcular subtotal, total de IVA y total a pagar
  let subtotal = datosFactura.LineaDeDetalle.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  let totalIVA = datosFactura.LineaDeDetalle.reduce((acc, item) => {
    return acc + item.price * item.quantity * (item.tax_rate / 100);
  }, 0);

  let totalPagar = subtotal + totalIVA;

  // Asegurarse de que los números sean de dos decimales
  subtotal = subtotal.toFixed(2);
  totalIVA = totalIVA.toFixed(2);
  totalPagar = totalPagar.toFixed(2);

  // Agregar los totales al objeto de datos de factura
  completeData.subtotal = subtotal;
  completeData.totalIVA = totalIVA;
  completeData.totalPagar = totalPagar;
  completeData.Emisor.Provincia = convertirProvincia(
    datosFactura.Emisor.Provincia
  );
  completeData.MedioDePago = convertirMedioDePago(datosFactura.MedioDePago);
  const html = compiledPug({ ...completeData, css: cssContent });

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setContent(html);
  // Construir la ruta completa del archivo PDF
  const pdfFilename = `Factura${datosFactura.KeyXml}.pdf`;
  const pdfPath = path.join(outputDirectory, pdfFilename);

  const widthPixels = (80 / 25.4) * 96; // Convertir 80 mm a píxeles
  await page.pdf({
    path: pdfPath,
    width: `${widthPixels}px`,
    height: '600px',
    printBackground: true,
    // No se especifica la altura para que sea automática
  });
  await browser.close();
  // Retornar la ruta del archivo PDF
  console.log("la ruta es ",pdfPath );
  return pdfPath;
};
// Función para convertir el código de provincia a su nombre
function convertirProvincia(codigoProvincia) {
  const provincias = {
    1: "San José",
    2: "Alajuela",
    3: "Cartago",
    4: "Heredia",
    5: "Guanacaste",
    6: "Puntarenas",
    7: "Limón",
  };

  return provincias[codigoProvincia] || "Código de provincia desconocido";
}

// Función para convertir el código de medio de pago a su descripción
function convertirMedioDePago(codigoMedioDePago) {
  const mediosDePago = {
    "01": "Efectivo",
    "02": "Tarjeta",
    "03": "Cheque",
    "04": "Depósito bancario",
    "05": "Recaudado por terceros",
    99: "Otros",
  };

  return (
    mediosDePago[codigoMedioDePago] || "Código de medio de pago desconocido"
  );
}
module.exports = { generarFacturaPDF };


// 400px  + 20 x prod en ld
// 50px x mensaje opcional
// 
//
