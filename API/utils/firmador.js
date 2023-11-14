const fs = require('fs');
const { SignedXml } = require('xml-crypto');

class Firmador {
  static firmarXml(pfxPath, pin, xmlInputPath, xmlOutputPath) {
    // Leer el contenido del archivo XML
    const xml = fs.readFileSync(xmlInputPath, 'utf8');

    // Crear una nueva instancia de SignedXml
    const signedXml = new SignedXml();

    // Leer el contenido del archivo PFX
    const pfx = fs.readFileSync(pfxPath);

    // Cargar la clave privada desde el archivo PFX
    // Asumiendo que la clave privada está en formato PEM
    const privateKey = SignedXml.loadKeyFromPfx(pfx, pin);

    // Establecer la clave privada para la firma
    signedXml.signingKey = privateKey;

    // Crear una referencia al nodo raíz del documento XML
    signedXml.addReference("//*[local-name(.)='RootNodeName']");

    // Calcular la firma
    signedXml.computeSignature(xml);

    // Obtener el XML firmado
    const signedXmlText = signedXml.getSignedXml();

    // Guardar el XML firmado en el archivo de salida
    fs.writeFileSync(xmlOutputPath, signedXmlText, 'utf8');
  }
}

module.exports = Firmador;

// Uso:
// Firmador.firmarXml('path/to/your.pfx', 'your-pin', 'path/to/input.xml', 'path/to/output.xml');
