const fs = require("fs");
const Signer = require('haciendacostarica-signer');



async function firmarXml(pfxPath, password, xmlInputPath, xmlOutputPath) {
    // Leer el XML original
    const xml = fs.readFileSync(xmlInputPath, 'utf8');

    // Leer y convertir el archivo .p12 a Base64
    const archivoP12Buffer = fs.readFileSync(pfxPath);
    const archivoP12Base64 = archivoP12Buffer.toString('base64');

    // Firmar el XML
    const signedXmlBase64 = await Signer.sign(xml, archivoP12Base64, password);

    // Convertir el XML firmado de Base64 a string
    const signedXml = Buffer.from(signedXmlBase64, 'base64').toString('utf8');

    // Guardar el XML firmado
    fs.writeFileSync(xmlOutputPath, signedXml, 'utf8');
}
module.exports = firmarXml;



