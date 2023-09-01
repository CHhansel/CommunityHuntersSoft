const connection = require("../config/db"); // Ajusta la ruta según la ubicación de tu archivo de conexión

const createProperty = (req, res) => {
  const {
    id,
    name,
    description,
    state,
    province,
    canton,
    district,
    exact_address,
    user_id,
    antiquity,
  } = req.body;

  // Primero, verifica si la propiedad pertenece al usuario
  const checkQuery = "SELECT id FROM property WHERE id = ? AND user_id = ?";
  connection.query(checkQuery, [id, user_id], (err, result) => {
    if (err) {
      console.error("Error al verificar la propiedad:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (result.length === 0) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para actualizar esta propiedad" });
    }

    // Si la propiedad pertenece al usuario, procede con la creación
    const query = "CALL sp_create_property(?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      province,
      canton,
      district,
      exact_address,
      name,
      description,
      state,
      antiquity,
      user_id,
    ];

    connection.query(query, values, (err, result) => {
      if (err) {
        console.error("Error al crear la propiedad:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }

      // La propiedad se creó correctamente
      res.json({ message: "Propiedad creada exitosamente" });
    });
  });
};

const updateProperty = (req, res) => {
  const { Id, name, description, state, antiquity, province, canton, district, exact_address } =
    req.body; // Obtiene los datos actualizados desde el cuerpo de la solicitud

  // Crear la consulta SQL para actualizar la propiedad en la base de datos
  const updateQuery = "CALL sp_update_property(?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const updateValues = [
    Id,
    name,
    description,
    state,
    antiquity,
    province,
    canton,
    district,
    exact_address,
  ];

  // Ejecutar la consulta en la base de datos
  connection.query(updateQuery, updateValues, (err) => {
    if (err) {
      console.error("Error al actualizar la propiedad:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    // Consulta SQL para obtener la propiedad actualizada
    const selectQuery = "SELECT * FROM property_view WHERE id = ?";
    
    connection.query(selectQuery, [Id], (err, results) => {
      if (err) {
        console.error("Error al obtener la propiedad actualizada:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }

      // Verifica si se obtuvo algún resultado
      if (results.length === 0) {
        return res.status(404).json({ error: "Propiedad no encontrada" });
      }
      const updatedProperty = results[0];
      delete updatedProperty.user_id;
      
      const rawDate = new Date(updatedProperty.antiquity);
      updatedProperty.antiquity = `${rawDate.getFullYear()}-${String(
        rawDate.getMonth() + 1
      ).padStart(2, "0")}-${String(rawDate.getDate()).padStart(2, "0")}`;

      // Devuelve la propiedad actualizada
      res.json({
        message: "Propiedad actualizada exitosamente",
        updatedProperty
      });
    });
  });
};


const deleteProperty = (req, res) => {
  const { id } = req.params; // Obtiene el ID de la propiedad a borrar desde los parámetros de la URL

  // Crear la consulta SQL para obtener el address_info_id de la propiedad que estamos borrando
  const getAddressInfoIdQuery =
    "SELECT address_info_id FROM property WHERE id = ?";
  const getAddressInfoIdValues = [id];

  // Ejecutar la consulta para obtener el address_info_id
  connection.query(
    getAddressInfoIdQuery,
    getAddressInfoIdValues,
    (err, result) => {
      if (err) {
        console.error("Error al obtener address_info_id:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }

      const addressInfoId = result[0]?.address_info_id || null;

      // Crear la consulta SQL para borrar la propiedad de la base de datos
      const deleteQuery = "DELETE FROM property WHERE id = ?";
      const deleteValues = [id];

      // Ejecutar la consulta para borrar la propiedad
      connection.query(deleteQuery, deleteValues, (err, result) => {
        if (err) {
          console.error("Error al borrar la propiedad:", err);
          return res.status(500).json({ error: "Error interno del servidor" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Propiedad no encontrada" });
        }

        // Si hay un address_info_id asociado, también borramos la fila correspondiente en la tabla address_info
        if (addressInfoId) {
          const deleteAddressInfoQuery =
            "DELETE FROM address_info WHERE id = ?";
          const deleteAddressInfoValues = [addressInfoId];

          // Ejecutar la consulta para borrar la fila en la tabla address_info
          connection.query(
            deleteAddressInfoQuery,
            deleteAddressInfoValues,
            (err, result) => {
              if (err) {
                console.error("Error al borrar la fila en address_info:", err);
                return res
                  .status(500)
                  .json({ error: "Error interno del servidor" });
              }

              res.json({
                message: "Propiedad y dirección asociada borradas exitosamente",
              });
            }
          );
        } else {
          res.json({ message: "Propiedad borrada exitosamente" });
        }
      });
    }
  );
};
const getPropertiesByUserId = (req, res) => {
  const { id, page, itemsPerPage } = req.query;

  // Valida que los parámetros necesarios estén presentes
  if (!id || !page || !itemsPerPage) {
    return res.status(400).json({ error: "Faltan parámetros requeridos" });
  }

  // Llama al procedimiento almacenado para obtener las propiedades paginadas
  const query = "CALL sp_get_properties_by_user_id(?, ?, ?)";
  const values = [id, page, itemsPerPage];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al obtener las propiedades:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    // El procedimiento devuelve un conjunto de resultados, accedemos a la primera posición para obtener las propiedades
    const properties = result[0];

    // También podemos obtener el total de propiedades sin paginación
    const totalProperties = result[1][0].total_properties;

    // Verifica si se obtuvieron propiedades
    if (properties.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron propiedades para el usuario dado" });
    }
    properties.map((property) => {
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
  const updateQuery = "UPDATE property SET state = ? WHERE id = ?";
  const updateValues = [state, id];

  // Ejecutar la consulta en la base de datos
  connection.query(updateQuery, updateValues, (err, result) => {
    if (err) {
      console.error("Error al actualizar el estado de la propiedad:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    res.json({ message: "Estado de la propiedad actualizado exitosamente" });
  });
};
function formatCreationDateInArray(properties) {
  return properties.map((property) => {
    if (property.creation_date) {
      const rawDate = new Date(property.creation_date);
      property.creation_date = `${rawDate.getFullYear()}-${String(
        rawDate.getMonth() + 1
      ).padStart(2, "0")}-${String(rawDate.getDate()).padStart(2, "0")}`;
    }
    if (property.antiquity) {
      const rawDate = new Date(property.antiquity);
      property.antiquity = `${rawDate.getFullYear()}-${String(
        rawDate.getMonth() + 1
      ).padStart(2, "0")}-${String(rawDate.getDate()).padStart(2, "0")}`;
    }
    if (property.start_date) {
      const rawDate = new Date(property.start_date);
      property.start_date = `${rawDate.getFullYear()}-${String(
        rawDate.getMonth() + 1
      ).padStart(2, "0")}-${String(rawDate.getDate()).padStart(2, "0")}`;
    }
    if (property.end_date) {
      const rawDate = new Date(property.end_date);
      property.end_date = `${rawDate.getFullYear()}-${String(
        rawDate.getMonth() + 1
      ).padStart(2, "0")}-${String(rawDate.getDate()).padStart(2, "0")}`;
    }
    return property;
  });
}

module.exports = {
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesByUserId,
  updatePropertyState,
};
