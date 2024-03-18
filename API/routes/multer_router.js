
const { Router } = require("express");
const pool = require('../config/db2'); // Asegúrate de ajustar la ruta según sea necesario
const upload = require('../multerConfig'); // Asegúrate de ajustar la ruta según sea necesario

const router = Router();

router.post('/upload-img', upload.single('myFile'), (req, res) => {
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

router.post('/upload-certificate', upload.single('certificateFile'), async (req, res) => {
  const file = req.file;
  const { company_id } = req.body; // Asegúrate de enviar esto desde el cliente
  
  if (!file) {
      return res.status(400).send('No se subió ningún certificado.');
  }

  // Construye la ruta del archivo para almacenarla en la base de datos
  const certificatePath = `/fileSystem/private/${file.filename}`; // Ajusta según tu estructura de directorios

  try {
      const query = `UPDATE company_credentials SET certificate_url = ? WHERE company_id = ?`;
      const values = [certificatePath, company_id];
      
      // Utiliza pool.query directamente para ejecutar la consulta SQL
      await pool.query(query, values);

      res.json({
          message: 'Certificado .p12 subido y actualizado con éxito.',
          fileId: file.filename, // O un identificador único si lo prefieres
      });
  } catch (error) {
      console.error('Error al actualizar la base de datos:', error);
      return res.status(500).send('Error al procesar la solicitud.');
  }
});

module.exports = router;
