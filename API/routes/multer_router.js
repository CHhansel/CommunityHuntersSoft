
const { Router } = require("express");
const upload = require('../multerConfig'); // Asegúrate de ajustar la ruta según sea necesario

const router = Router();

router.post('/upload-file', upload.single('myFile'), (req, res) => {
  const file = req.file;
  console.log("Archivo subido: ", file);
  
  if (!file) {
    return res.status(400).send('No se subió ningún archivo.');
  }

  // Construir la ruta de acceso público para el archivo
  // Asegúrate de que esta base de ruta refleje cómo sirves los archivos estáticos en tu servidor
  const baseUrl = req.protocol + '://' + req.get('host') + '/uploads/';
  const filePath = baseUrl + file.filename;

  // Devolver la ruta del archivo como parte de la respuesta
  res.json({
    message: 'Archivo subido con éxito.',
    path: filePath
  });
});

module.exports = router;
