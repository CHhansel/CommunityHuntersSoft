const connection = require('../config/db'); // Ajusta la ruta según la ubicación de tu archivo de conexión


const updateAddress = (req, res) => {
    const { addressId } = req.params; // Obtiene el ID de la dirección a actualizar desde los parámetros de la URL
    const { province, canton, district, exact_address } = req.body; // Obtiene los datos actualizados desde el cuerpo de la solicitud
  
    // Realiza las validaciones necesarias en el cuerpo de la solicitud
  
    // Crear la consulta SQL para actualizar la dirección en la base de datos
    const updateQuery =
      'UPDATE address_info SET province = ?, canton = ?, district = ?, exact_address = ? WHERE id = ?';
    const updateValues = [province, canton, district, exact_address, addressId];
  
    // Ejecutar la consulta en la base de datos
    connection.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error('Error al actualizar la dirección:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Dirección no encontrada' });
      }
  
      res.json({ message: 'Dirección actualizada exitosamente' });
    });
  };
  

  module.exports = {updateAddress};
  