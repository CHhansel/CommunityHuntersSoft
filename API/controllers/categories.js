const pool = require("../config/db2"); // Asegúrate de usar la configuración correcta para tu base de datos

// Controlador para insertar una nueva categoría de producto
const insertProductCategory = async (req, res) => {
  // Extraer los datos de la solicitud
  const { company_id, name, description, image_url, active, sort_order } =
    req.body;

  // Validar los datos de entrada (puedes usar express-validator aquí)

  try {
    // Llamar al procedimiento almacenado InsertProductCategory
    const query = "CALL InsertProductCategory(?, ?, ?, ?, ?, ?)";
    const values = [
      company_id,
      name,
      description,
      image_url,
      active,
      sort_order,
    ];

    await pool.query(query, values);

    // Enviar una respuesta de éxito
    res.json({ message: "Categoría de producto creada exitosamente" });
  } catch (err) {
    console.error("Error al insertar la categoría de producto:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const getCategoriesByCompanyId = async (req, res) => {
  const { company_id } = req.query;

  // Valida que el parámetro necesario esté presente
  if (!company_id) {
    return res
      .status(400)
      .json({ error: "Falta el parámetro requerido 'company_id'" });
  }

  const query = "CALL sp_get_categories_by_company_id(?)";
  const values = [company_id];

  try {
    const [result] = await pool.query(query, values);
    // El procedimiento devuelve dos conjuntos de resultados: las categorías y el total
    const categories = result[0];
    const totalCategories = result[1][0].total_categories;

    if (categories.length === 0) {
      return res.status(404).json({
        error: "No se encontraron categorías para la compañía dada",
        totalCategories: 0,
      });
    }

    res.json({ categories, totalCategories });
  } catch (err) {
    console.error("Error al obtener las categorías:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
// Controlador para insertar una nueva relación producto-categoría
const insertProductCategoryRelation = async (req, res) => {
  // Extraer los datos de la solicitud
  const { product_id, category_id, company_id } = req.body;

  // Validar los datos de entrada (puedes usar express-validator aquí)

  try {
    // Consulta para insertar la nueva relación en la base de datos
    const query = `
            INSERT INTO product_category_relation (product_id, category_id, company_id)
            VALUES (?, ?, ?);
        `;
    const values = [product_id, category_id, company_id];

    const [result] = await pool.query(query, values);

    // Enviar una respuesta de éxito
    res.json({
      message: "Relación producto-categoría creada exitosamente",
      relationId: result.insertId,
    });
  } catch (err) {
    console.error("Error al insertar la relación producto-categoría:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getRelationsByCompanyId = async (req, res) => {
  // Extraer el company_id de la solicitud
  const { company_id } = req.params; // Asumiendo que se pasa como parámetro en la URL

  try {
    // Consulta que selecciona las relaciones pertenecientes a una compañía específica
    const query = `
            SELECT pcr.*, p.name AS product_name, pc.name AS category_name
            FROM product_category_relation pcr
            JOIN product p ON pcr.product_id = p.id
            JOIN product_categories pc ON pcr.category_id = pc.id
            WHERE p.company_id = ?;
        `;
    const values = [company_id];

    const [relations] = await pool.query(query, values);

    if (relations.length === 0) {
      return res
        .status(404)
        .json({
          message: "No se encontraron relaciones para la compañía especificada",
        });
    }

    // Enviar una respuesta con las relaciones encontradas
    res.json({ relations });
  } catch (err) {
    console.error("Error al obtener las relaciones por company_id:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  insertProductCategory,
  getCategoriesByCompanyId,
  insertProductCategoryRelation,
  getRelationsByCompanyId,
};
