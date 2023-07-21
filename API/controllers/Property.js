const connection = require('../config/db'); // Ajusta la ruta según la ubicación de tu archivo de conexión

const createProperty = (req, res) => {
    const { name, description, state, province, canton, district, exact_address, user_info_id } = req.body;
  
    // Realiza las validaciones necesarias en el cuerpo de la solicitud
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    // Crear la consulta SQL para llamar al procedimiento almacenado CreateProperty
    const query = 'CALL CreateProperty(?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [name, description, state, province, canton, district, exact_address, user_info_id, null]; // Pasamos 'null' para address_info_id ya que será generado automáticamente por el procedimiento almacenado
  
    // Ejecutar la consulta en la base de datos
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error al crear la propiedad:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      // La propiedad se creó correctamente
      res.json({ message: 'Propiedad creada exitosamente', propertyId: result[0][0].id });
    });
  };
  const updateProperty = (req, res) => {
    const { id } = req.params; // Obtiene el ID de la propiedad a actualizar desde los parámetros de la URL
    const { name, description, state, province, canton, district, exact_address } = req.body; // Obtiene los datos actualizados desde el cuerpo de la solicitud
  
    // Realiza las validaciones necesarias en el cuerpo de la solicitud
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    // Crear la consulta SQL para actualizar la propiedad en la base de datos
    const updateQuery = 'CALL UpdatePropertyAndAddress(?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const updateValues = [id, name, description, state, province, canton, district, exact_address, null]; // Pasamos 'null' para user_info_id ya que no será actualizado en esta operación
  
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
  
    // Crear la consulta SQL para obtener el address_info_id de la propiedad que estamos borrando
    const getAddressInfoIdQuery = 'SELECT address_info_id FROM property WHERE id = ?';
    const getAddressInfoIdValues = [id];
  
    // Ejecutar la consulta para obtener el address_info_id
    connection.query(getAddressInfoIdQuery, getAddressInfoIdValues, (err, result) => {
      if (err) {
        console.error('Error al obtener address_info_id:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      const addressInfoId = result[0]?.address_info_id || null;
  
      // Crear la consulta SQL para borrar la propiedad de la base de datos
      const deleteQuery = 'DELETE FROM property WHERE id = ?';
      const deleteValues = [id];
  
      // Ejecutar la consulta para borrar la propiedad
      connection.query(deleteQuery, deleteValues, (err, result) => {
        if (err) {
          console.error('Error al borrar la propiedad:', err);
          return res.status(500).json({ error: 'Error interno del servidor' });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Propiedad no encontrada' });
        }
  
        // Si hay un address_info_id asociado, también borramos la fila correspondiente en la tabla address_info
        if (addressInfoId) {
          const deleteAddressInfoQuery = 'DELETE FROM address_info WHERE id = ?';
          const deleteAddressInfoValues = [addressInfoId];
  
          // Ejecutar la consulta para borrar la fila en la tabla address_info
          connection.query(deleteAddressInfoQuery, deleteAddressInfoValues, (err, result) => {
            if (err) {
              console.error('Error al borrar la fila en address_info:', err);
              return res.status(500).json({ error: 'Error interno del servidor' });
            }
  
            res.json({ message: 'Propiedad y dirección asociada borradas exitosamente' });
          });
        } else {
          res.json({ message: 'Propiedad borrada exitosamente' });
        }
      });
    });
  };
  const getPropertiesByUserId = (req, res) => {
    const { user_info_id, page, itemsPerPage } = req.query;
  
    // Valida que los parámetros necesarios estén presentes
    if (!user_info_id || !page || !itemsPerPage) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }
  
    // Llama al procedimiento almacenado para obtener las propiedades paginadas
    const query = 'CALL sp_get_properties_by_user_id(?, ?, ?)';
    const values = [user_info_id, page, itemsPerPage];
  
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error al obtener las propiedades:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      // El procedimiento devuelve un conjunto de resultados, accedemos a la primera posición para obtener las propiedades
      const properties = result[0];
  
      // También podemos obtener el total de propiedades sin paginación
      const totalProperties = result[1][0].total_properties;
  
      // Verifica si se obtuvieron propiedades
      if (properties.length === 0) {
        return res.status(404).json({ error: 'No se encontraron propiedades para el usuario dado' });
      }
  
      // Devuelve las propiedades paginadas y el total de propiedades sin paginación
      res.json({ properties, totalProperties });
    });
  };
  module.exports = {
    createProperty,
    updateProperty,
    deleteProperty,
    getPropertiesByUserId
  };