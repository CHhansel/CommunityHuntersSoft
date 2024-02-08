const pool = require("../config/db2"); // Asegúrate de usar la configuración correcta para tu base de datos

const insertRestaurantTable = async (req, res) => {
  // Extraer los datos de la solicitud
  const { number, max_capacity, description, reserved, in_use, company_id } =
    req.body;

  // Validar los datos de entrada (puedes usar express-validator aquí)

  try {
    // Llamar al procedimiento almacenado InsertRestaurantTable
    const query = "CALL InsertRestaurantTable(?, ?, ?, ?, ?, ?)";
    const values = [
      number,
      max_capacity,
      description,
      reserved,
      in_use,
      company_id,
    ];

    await pool.query(query, values);

    // Enviar una respuesta de éxito
    res.json({ message: "Mesa de restaurante creada exitosamente" });
  } catch (err) {
    console.error("Error al insertar la mesa de restaurante:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
// Controlador para obtener todas las mesas de restaurante de una compañía
const getRestaurantTablesByCompany = async (req, res) => {
  // Extraer el company_id de la solicitud
  const { company_id } = req.query; // Asumiendo que se pasa como parámetro en la URL

  try {
    // Consulta que selecciona todas las mesas de restaurante de la compañía
    const query = "SELECT * FROM restaurant_table WHERE company_id = ?";
    const values = [company_id];

    const [result] = await pool.query(query, values);

    if (result.length === 0) {
      return res
        .status(404)
        .json({
          message: "No se encontraron mesas para la compañía especificada",
        });
    }

    // Enviar una respuesta con las mesas encontradas
    res.json({ result });
  } catch (err) {
    console.error(
      "Error al obtener las mesas de restaurante por company_id:",
      err
    );
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
// Controlador para eliminar una mesa de restaurante por su ID
const deleteRestaurantTableById = async (req, res) => {
  // Extraer el ID de la solicitud
  const { id } = req.params;

  try {
    // Realizar la eliminación en la base de datos
    const query = `
      DELETE FROM restaurant_table
      WHERE id=?
    `;
    const values = [id];

    await pool.query(query, values);

    // Enviar una respuesta de éxito
    res.json({ message: "Mesa de restaurante eliminada exitosamente" });
  } catch (err) {
    console.error("Error al eliminar la mesa de restaurante:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
// Controlador para actualizar una mesa de restaurante
const updateRestaurantTable = async (req, res) => {
  // Extraer los datos de la solicitud
  const { id, number, max_capacity, description, reserved, in_use } = req.body;

  // Validar los datos de entrada (puedes usar express-validator aquí)

  try {
    // Realizar la actualización en la base de datos
    const query = `
      UPDATE restaurant_table
      SET number=?, max_capacity=?, description=?, reserved=?, in_use=?
      WHERE id=?
    `;
    const values = [number, max_capacity, description, reserved, in_use, id];

    await pool.query(query, values);

    // Enviar una respuesta de éxito
    res.json({ message: "Mesa de restaurante actualizada exitosamente" });
  } catch (err) {
    console.error("Error al actualizar la mesa de restaurante:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  insertRestaurantTable,
  getRestaurantTablesByCompany,
  deleteRestaurantTableById,
  updateRestaurantTable
};
