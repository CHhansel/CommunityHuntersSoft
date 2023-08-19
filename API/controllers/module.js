
const connection = require('../config/db'); // Ajusta la ruta según la ubicación de tu archivo de conexión



const getAccessModulesByUserRole = (req, res) => {
  const { user_role_id } = req.query;

  // Consulta SQL para obtener los registros de rol_access_module por user_rol_id
  const query = 'SELECT * FROM access_module_view WHERE user_role_id = ?';
  const values = [user_role_id];
  // Ejecutar la consulta en la base de datos
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error al obtener los registros:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    // Devolver los registros obtenidos
    res.json({ accessModules: results });
  });
};

module.exports = {
  getAccessModulesByUserRole
};
