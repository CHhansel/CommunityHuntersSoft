const connection = require('../config/db'); // Ajusta la ruta según la ubicación de tu archivo de conexión

// Controlador para crear una nueva propiedad
const createProperty = (req, res) => {
    const { name, address_info_id, description, state, user_info_id } = req.body;
  
    // Crear la consulta SQL para insertar una nueva propiedad en la tabla `property`
    const query = 'INSERT INTO property (name, address_info_id, description, state, user_info_id) VALUES (?, ?, ?, ?, ?)';
    const values = [name, address_info_id, description, state, user_info_id];
  
    // Ejecutar la consulta en la base de datos
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error al crear la propiedad:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      // La propiedad se creó correctamente
      res.json({ message: 'Propiedad creada exitosamente', propertyId: result.insertId });
    });
  };
  const updateProperty = (req, res) => {
    const { id } = req.params; // Obtiene el ID de la propiedad a actualizar desde los parámetros de la URL
    const { name, address_info_id, description, state } = req.body; // Obtiene los datos actualizados desde el cuerpo de la solicitud
  
    // Realiza las validaciones necesarias en el cuerpo de la solicitud
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    // Crear la consulta SQL para actualizar la propiedad en la base de datos
    const updateQuery = 'UPDATE property SET name = ?, address_info_id = ?, description = ?, state = ? WHERE id = ?';
    const updateValues = [name, address_info_id, description, state, id];
  
    // Ejecutar la consulta en la base de datos
    connection.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error('Error al actualizar la propiedad:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Propiedad no encontrada' });
      }
  
      res.json({ message: 'Propiedad actualizada exitosamente' });
    });
  };
  const deleteProperty = (req, res) => {
    const { id } = req.params; // Obtiene el ID de la propiedad a borrar desde los parámetros de la URL
  
    // Crear la consulta SQL para borrar la propiedad de la base de datos
    const deleteQuery = 'DELETE FROM property WHERE id = ?';
    const deleteValues = [id];
  
    // Ejecutar la consulta en la base de datos
    connection.query(deleteQuery, deleteValues, (err, result) => {
      if (err) {
        console.error('Error al borrar la propiedad:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Propiedad no encontrada' });
      }
  
      res.json({ message: 'Propiedad borrada exitosamente' });
    });
  };

  module.exports = {
    createProperty,
    updateProperty,
    deleteProperty
  };