const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Determina el tipo de archivo basado en el nombre del campo o en el MIME type
    // Aquí usamos el nombre del campo como ejemplo
    if (file.fieldname === 'certificateFile') { // Asumiendo que 'certificateFile' es el nombre del campo para archivos .p12
      // Cambia a la ruta de destino para archivos .p12
      cb(null, path.join(__dirname, 'fileSystem/private'));
    } else {
      // Ruta de destino para otros archivos, como imágenes
      cb(null, path.join(__dirname, 'fileSystem/imgs'));
    }
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
