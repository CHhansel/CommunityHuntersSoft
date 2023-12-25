const puppeteer = require('puppeteer');
const pug = require('pug');
const fs = require('fs');
const path = require('path');

async function generarFacturaPDF(datos) {
    // Compila la plantilla Pug y genera el HTML
    const compiledPug = pug.compileFile(path.join(__dirname, 'BillTemplates', 'bill.pug'));
    const html = compiledPug(datos);

    // Usa Puppeteer para abrir el HTML y convertirlo en PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const widthPixels = 80 / 25.4 * 96; // Convertir 80 mm a píxeles

    // Configura aquí las opciones de tu PDF (tamaño de página, márgenes, etc.)
    const pdfOptions = {
        path: `factura${datos.KeyXml}.pdf`, // El nombre de archivo para el PDF
        format: 'A4',
        width: `${widthPixels}px`,
        printBackground: true
    };

    await page.pdf(pdfOptions);

    await browser.close();
}

generarFacturaPDF(datosFactura)
    .then(() => console.log('Factura generada con éxito.'))
    .catch(error => console.error('Error al generar la factura:', error));
