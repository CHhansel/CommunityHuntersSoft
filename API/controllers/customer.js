const connection = require("../config/db"); // Ajusta la ruta según la ubicación de tu archivo de conexión

const createCustomer = (req, res) => {
  const {
    name,
    dni,
    dni_type_id,
    email,
    province,
    canton,
    district,
    exact_address,
    company_name,
    company_id,
  } = req.body;

  // Ejecutar el procedimiento almacenado para crear un nuevo cliente en la base de datos
  const query =
    "CALL CreateCustomerWithAddress(?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
  const values = [
    name,
    dni,
    dni_type_id,
    email,
    province,
    canton,
    district,
    exact_address,
    company_name,
    company_id,
  ];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al crear el cliente:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    res.json({ message: "Cliente creado exitosamente" });
  });
};

const getCustomersByUserId = (req, res) => {
  const { company_id, page, itemsPerPage } = req.query;

  // Valida que los parámetros necesarios estén presentes
  if (!company_id || !page || !itemsPerPage) {
    return res.status(400).json({ error: "Faltan parámetros requeridos" });
  }

  // Llama al procedimiento almacenado para obtener los clientes paginados
  const query = "CALL sp_get_customers_by_user_id(?, ?, ?)";
  const values = [company_id, page, itemsPerPage];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al obtener los clientes:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    // El procedimiento devuelve un conjunto de resultados, accedemos a la primera posición para obtener los clientes
    const customers = result[0];

    // También podemos obtener el total de clientes sin paginación
    const totalCustomers = result[1][0].total_customers;

    // Verifica si se obtuvieron clientes
    if (customers.length === 0) {
      return res.json({
        error: "No se encontraron clientes para el usuario dado",
        errorStatus: 0,
      });
    }
    customers.map((customers) => {
      delete customers.user_id;
      return customers;
    });
    customersFormatDate = formatCreationDateInArray(customers);
    // Devuelve los clientes paginados y el total de clientes sin paginación
    res.json({ customers, totalCustomers });
  });
};

const updateCustomer = (req, res) => {
  const { customerId } = req.params; // Obtiene el ID del cliente a actualizar desde los parámetros de la URL
  const { name, dni, dni_type_id, email, note } = req.body; // Obtiene los datos actualizados desde el cuerpo de la solicitud

  // Crear la consulta SQL para actualizar los datos del cliente en la base de datos
  const updateQuery =
    "UPDATE customer SET name = ?, dni = ?, dni_type_id = ?, email = ?, note = ? WHERE id = ?";
  const updateValues = [
    name,
    dni,
    dni_type_id,
    email,
    note,
    customerId,
  ];

  // Ejecutar la consulta en la base de datos
  connection.query(updateQuery, updateValues, (err, result) => {
    if (err) {
      console.error("Error al actualizar los datos del cliente:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json({ message: "Datos del cliente actualizados exitosamente" });
  });
};
const deleteCustomer = (req, res) => {
  const { id } = req.params; // Obtiene el ID del cliente a borrar desde los parámetros de la URL

  // Ejecutar el procedimiento almacenado para eliminar el cliente y su dirección asociada
  const deleteQuery = "CALL sp_delete_customer_and_address(?)";
  const deleteValue = [id];

  connection.query(deleteQuery, deleteValue, (err, result) => {
    if (err) {
      console.error("Error al borrar el cliente y la dirección:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json({ message: "Cliente y dirección asociada borrados exitosamente" });
  });
};
function formatCreationDateInArray(data) {
  return data.map((data) => {
    if (data.creation_date) {
      const rawDate = data.creation_date;
      const formattedDate = new Date(rawDate).toLocaleDateString();
      data.creation_date = formattedDate;
    }
    return data;
  });
}
const getAllDniTypes = (req, res) => {
  // Consulta SQL para obtener todos los elementos de la tabla tiposdeidentificacion
  const selectQuery = `
      SELECT * FROM tiposdeidentificacion
  `;

  // Ejecutar la consulta en la base de datos
  connection.query(selectQuery, (err, results) => {
      if (err) {
          console.error('Error al obtener los tipos de DNI:', err);
          return res.status(500).json({ error: 'Error interno del servidor' });
      }

      res.json({ dniTypes: results });
  });
};

module.exports = {
  createCustomer,
  updateCustomer,
  getCustomersByUserId,
  deleteCustomer,
  getAllDniTypes
};
