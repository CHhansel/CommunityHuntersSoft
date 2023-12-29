const puppeteer = require('puppeteer');
const pug = require('pug');
const fs = require('fs');
const path = require('path');

 const generarFacturaPDF = async (datosFactura)=> {
    // Leer el contenido del archivo CSS
    const cssContent = fs.readFileSync(path.join(__dirname, './BillTemplates', 'Billstyles.css'), 'utf8');
  
    // Compilar la plantilla Pug con el contenido del CSS
    const compiledPug = pug.compileFile(path.join(__dirname, './BillTemplates', 'bill.pug'));
    const html = compiledPug({ ...datosFactura, css: cssContent });
  
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    await page.setContent(html);
  
    const widthPixels = 80 / 25.4 * 96; // Convertir 80 mm a píxeles
    await page.pdf({
      path: `Factura${datosFactura.KeyXml}.pdf`,
      width: `${widthPixels}px`,
      printBackground: true,
      // No se especifica la altura para que sea automática
    });
    await browser.close();
  }

  module.exports = { generarFacturaPDF };