const connection = require("../config/db"); // Ajusta la ruta según la ubicación de tu archivo de conexión

const createProperty = (req, res) => {
  const {
    name,
    description,
    state,
    province,
    canton,
    district,
    exact_address,
    company_id,
    antiquity,
  } = req.body;

  // Procede con la creación de la propiedad
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
    company_id,
  ];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al crear la propiedad:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    const updatedProperty = result[0];
    const rawDate = new Date(updatedProperty.antiquity);

    updatedProperty.antiquity = `${rawDate.getFullYear()}-${String(
      rawDate.getMonth() + 1
    ).padStart(2, "0")}-${String(rawDate.getDate()).padStart(2, "0")}`;
    // La propiedad se creó correctamente
    res.json({ message: "Propiedad creada exitosamente",updatedProperty });
    
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
      
      propertiesFormatDate = formatCreationDateInObject(updatedProperty);
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
const getPropertiesByCompanyId = (req, res) => {
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
        .json({ error: "No se encontraron propiedades para el usuario dado",totalProperties:0 });
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
function formatCreationDateInObject(property) {
  if (property.creation_date) {
    const rawDateCreation = new Date(property.creation_date);
    property.creation_date = `${rawDateCreation.getFullYear()}-${String(
      rawDateCreation.getMonth() + 1
    ).padStart(2, "0")}-${String(rawDateCreation.getDate()).padStart(2, "0")}`;
  }
  if (property.antiquity) {
    const rawDateAntiquity = new Date(property.antiquity);
    property.antiquity = `${rawDateAntiquity.getFullYear()}-${String(
      rawDateAntiquity.getMonth() + 1
    ).padStart(2, "0")}-${String(rawDateAntiquity.getDate()).padStart(2, "0")}`;
  }
  if (property.start_date) {
    const rawDateStart = new Date(property.start_date);
    property.start_date = `${rawDateStart.getFullYear()}-${String(
      rawDateStart.getMonth() + 1
    ).padStart(2, "0")}-${String(rawDateStart.getDate()).padStart(2, "0")}`;
  }
  if (property.end_date) {
    const rawDateEnd = new Date(property.end_date);
    property.end_date = `${rawDateEnd.getFullYear()}-${String(
      rawDateEnd.getMonth() + 1
    ).padStart(2, "0")}-${String(rawDateEnd.getDate()).padStart(2, "0")}`;
  }
  return property;
}

const updatePropertyContract = (req, res) => {
  const {
    Id,
    customer_id,
    start_date,
    end_date,
    state,
    deposit_amount,
    rent_amount,
    tax_amount,
    total_amount,
    payment_method,
    payment_date,
    contract_file
  } = req.body; // Obtiene los datos del contrato desde el cuerpo de la solicitud
  // Crear la consulta SQL para actualizar los campos del contrato en la base de datos
  const updateQuery = "CALL sp_update_property_contract(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const updateValues = [
    Id,
    customer_id,
    start_date,
    end_date,
    state,
    deposit_amount,
    rent_amount,
    tax_amount,
    total_amount,
    payment_method,
    payment_date,
    contract_file
  ];

  // Ejecutar la consulta en la base de datos
  connection.query(updateQuery, updateValues, (err) => {
    if (err) {
      console.error("Error al actualizar el contrato de la propiedad:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    // Consulta SQL para obtener la propiedad con el contrato actualizado
    const selectQuery = "SELECT * FROM property_view WHERE id = ?";
    
    connection.query(selectQuery, [Id], (err, results) => {
      if (err) {
        console.error("Error al obtener la propiedad con el contrato actualizado:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }

      // Verifica si se obtuvo algún resultado
      if (results.length === 0) {
        return res.status(404).json({ error: "Propiedad no encontrada" });
      }
      const updatedProperty = results[0];
      delete updatedProperty.user_id;
      
      propertiesFormatDate = formatCreationDateInObject(updatedProperty);
      // Devuelve la propiedad con el contrato actualizado
      res.json({
        message: "Contrato de la propiedad actualizado exitosamente",
        updatedProperty
      });
    });
  });
};
module.exports = {
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesByCompanyId,
  updatePropertyContract
};
