const connection = require('../config/db'); // Ajusta la ruta según la ubicación de tu archivo de conexión

const createProperty = (req, res) => {
    const { name, description, state, province, canton, district, exact_address, user_id } = req.body;
    // Realiza las validaciones necesarias en el cuerpo de la solicitud
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(422).json({ errors: errors.array() });
    // }
  
    // Crear la consulta SQL para llamar al procedimiento almacenado CreateProperty
    const query = 'CALL sp_create_property(?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [name, description, state, province, canton, district, exact_address, user_id]; 
  
    // Ejecutar la consulta en la base de datos
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error al crear la propiedad:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      // La propiedad se creó correctamente
      res.json({ message: 'Propiedad creada exitosamente'});
    });
  };
  const updateProperty = (req, res) => {
    const { id } = req.query; // Obtiene el ID de la propiedad a actualizar desde los parámetros de la URL
    const { name, description, province, canton, district, exact_address } = req.body; // Obtiene los datos actualizados desde el cuerpo de la solicitud
  
    // Realiza las validaciones necesarias en el cuerpo de la solicitud
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(422).json({ errors: errors.array() });
    // }
  
    // Crear la consulta SQL para actualizar la propiedad en la base de datos
    const updateQuery = 'CALL UpdatePropertyAndAddress(?, ?, ?, ?, ?, ?, ?)';
    const updateValues = [id, name, description, province, canton, district, exact_address]; // Pasamos 'null' para user_info_id ya que no será actualizado en esta operación
  
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
    const { id, page, itemsPerPage } = req.query;
  
    // Valida que los parámetros necesarios estén presentes
    if (!id || !page || !itemsPerPage) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }
  
    // Llama al procedimiento almacenado para obtener las propiedades paginadas
    const query = 'CALL sp_get_properties_by_user_id(?, ?, ?)';
    const values = [id, page, itemsPerPage];
  
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
      properties.map(property => {
        delete property.user_id;
        return property;
      });
     propertiesFormatDate = formatCreationDateInArray(properties);

      // Devuelve las propiedades paginadas y el total de propiedades sin paginación
      res.json({ properties, totalProperties });
    });
  };

  const updatePropertyState = (req, res) => {
    const { id } = req.query; // Obtiene el ID de la propiedad a actualizar desde los parámetros de la URL
    const { state } = req.body; // Obtiene el nuevo estado desde el cuerpo de la solicitud
  
    // Crear la consulta SQL para actualizar únicamente el campo "state" de la propiedad en la base de datos
    const updateQuery = 'UPDATE property SET state = ? WHERE id = ?';
    const updateValues = [state, id];
  
    // Ejecutar la consulta en la base de datos
    connection.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error('Error al actualizar el estado de la propiedad:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Propiedad no encontrada' });
      }
  
      res.json({ message: 'Estado de la propiedad actualizado exitosamente' });
    });
  };

  function formatCreationDateInArray(properties) {
    return properties.map(property => {
        if (property.creation_date) {
            const rawDate = property.creation_date;
            const formattedDate = new Date(rawDate).toLocaleDateString();
            property.creation_date = formattedDate;
        }
        return property;
    });
}
  module.exports = {
    createProperty,
    updateProperty,
    deleteProperty,
    getPropertiesByUserId,
    updatePropertyState
  };