const fs = require('fs');
const forge = require('node-forge');
const { SignedXml } = require('xml-crypto');

//La firma del documento no es XAdES, se obtuvo [ERROR]
function extraerClaveYCertificado(pfxPath, password) {
  // Leer el archivo PFX
  const pfx = fs.readFileSync(pfxPath, 'binary');
  const pfxAsn1 = forge.asn1.fromDer(pfx);
  const pfxObj = forge.pkcs12.pkcs12FromAsn1(pfxAsn1, password);

  // Buscar la clave privada y el certificado
  let key = null;
  let cert = null;

  // Supongamos que solo hay un keyBag y un certBag
  const keyBags = pfxObj.getBags({bagType: forge.pki.oids.pkcs8ShroudedKeyBag});
  const certBags = pfxObj.getBags({bagType: forge.pki.oids.certBag});

  // Extraer la clave privada
  if (keyBags && keyBags[forge.pki.oids.pkcs8ShroudedKeyBag]) {
      const keyBag = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0];
      key = forge.pki.privateKeyToPem(keyBag.key);
  }
  // Extraer el certificado
  if (certBags && certBags[forge.pki.oids.certBag]) {
      const certBag = certBags[forge.pki.oids.certBag][0];
      cert = forge.pki.certificateToPem(certBag.cert);
  }

  return { privateKey: key, certificate: cert };
}
class Firmador {
  static firmarXml(pfxPath, password, xmlInputPath, xmlOutputPath) {
    const xml = fs.readFileSync(xmlInputPath, 'utf8');
    const signedXml = new SignedXml();

    // Extraer clave privada y certificado del PFX
    const { privateKey, certificate } = extraerClaveYCertificado(pfxPath, password);

    signedXml.privateKey = privateKey;


    // Calcular la firma
    signedXml.computeSignature(xml);

    // Guardar el XML firmado
    fs.writeFileSync(xmlOutputPath, signedXml.getSignedXml(), 'utf8');
}
  
}

module.exports = Firmador;
