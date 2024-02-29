const pool = require("../config/db2");

const insertProduct = async (req, res) => {
  const {
    internal_code,
    name,
    description,
    price,
    quantity,
    cabys_code,
    unit_of_measure,
    tax_rate,
    company_id,
    tax_included,
    image_url,
    category_ids, // Recibe un arreglo de IDs de categoría desde el frontend
  } = req.body;

  try {

    // Iniciar una transacción
    await pool.query("START TRANSACTION");

    // Insertar el producto
    const insertProductQuery =
      "INSERT INTO product (internal_code, name, description, price, quantity, cabys_code, unit_of_measure, tax_rate, company_id, tax_included, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const [productResult] = await pool.query(insertProductQuery, [
      internal_code,
      name,
      description,
      price,
      quantity,
      cabys_code,
      unit_of_measure,
      tax_rate,
      company_id,
      tax_included,
      image_url,
    ]);

    // Obtener el ID del producto insertado
    const productId = productResult.insertId;

    // Insertar las relaciones entre el producto y las categorías
    const insertRelationQuery =
      "INSERT INTO product_category_relation (product_id, category_id, company_id) VALUES (?, ?, ?)";
    for (const category_id of category_ids) {
      await pool.query(insertRelationQuery, [
        productId,
        category_id,
        company_id,
      ]);
    }

    // Confirmar la transacción si todo se ejecutó correctamente
    await pool.query("COMMIT");

    // Enviar una respuesta de éxito
    res.json({ message: "Producto creado exitosamente" });
  } catch (err) {
    // Hacer rollback en caso de error
    await pool.query("ROLLBACK");

    console.error("Error al insertar el producto:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const updateProduct = async (req, res) => {
  const {
    internal_code,
    name,
    description,
    price,
    comparison_price,
    cabys_code,
    unit_of_measure,
    tax_rate,
    company_id,
    tax_included,
    image_url,
    category_ids, // Recibe un arreglo de IDs de categoría desde el frontend
  } = req.body;
  const product_id = req.body.id;
  try {
    // Iniciar una transacción
    await pool.query("START TRANSACTION");

    // Actualizar el producto
    const updateProductQuery =
      "UPDATE product SET internal_code = ?, name = ?, description = ?, price = ?,comparison_price = ?, cabys_code = ?, unit_of_measure = ?, tax_rate = ?, company_id = ?, tax_included = ?, image_url = ? WHERE id = ?";
    await pool.query(updateProductQuery, [
      internal_code,
      name,
      description,
      price,
      comparison_price,
      cabys_code,
      unit_of_measure,
      tax_rate,
      company_id,
      tax_included,
      image_url,
      product_id,
    ]);

    // Obtener la lista de categorías asociadas al producto antes de la actualización
    const previousCategoriesQuery =
      "SELECT category_id FROM product_category_relation WHERE product_id = ?";
    const [previousCategoriesRows] = await pool.query(previousCategoriesQuery, [
      product_id,
    ]);
    const previousCategoryIds = previousCategoriesRows.map(
      (row) => row.category_id
    );

    // Determinar las categorías que se deben agregar, eliminar o mantener sin cambios
    const categoriesToAdd = category_ids.filter(
      (category_id) => !previousCategoryIds.includes(category_id)
    );
    const categoriesToDelete = previousCategoryIds.filter(
      (category_id) => !category_ids.includes(category_id)
    );
    const categoriesToKeep = category_ids.filter((category_id) =>
      previousCategoryIds.includes(category_id)
    );

    // Insertar las nuevas relaciones entre el producto y las categorías
    const insertRelationQuery =
      "INSERT INTO product_category_relation (product_id, category_id, company_id) VALUES (?, ?, ?)";
    for (const category_id of categoriesToAdd) {
      await pool.query(insertRelationQuery, [
        product_id,
        category_id,
        company_id,
      ]);
    }

    // Eliminar las relaciones anteriores que ya no están presentes en la lista de categorías
    const deleteRelationQuery =
      "DELETE FROM product_category_relation WHERE product_id = ? AND category_id = ?";
    for (const category_id of categoriesToDelete) {
      await pool.query(deleteRelationQuery, [product_id, category_id]);
    }

    // Confirmar la transacción si todo se ejecutó correctamente
    await pool.query("COMMIT");

    // Enviar una respuesta de éxito
    res.json({ message: "Producto actualizado exitosamente" });
  } catch (err) {
    // Hacer rollback en caso de error
    await pool.query("ROLLBACK");

    console.error("Error al actualizar el producto:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Actualizar el campo 'deleted' en lugar de eliminar el producto
    const updateProductQuery = "UPDATE product SET deleted = 1 WHERE id = ?";
    const [productResult] = await pool.query(updateProductQuery, [id]);

    // Verificar si el producto fue encontrado y actualizado
    if (productResult.affectedRows === 0) {
      return res.status(404).json({ error: "El producto no fue encontrado" });
    }

    // Enviar una respuesta de éxito
    res.json({ message: "Producto actualizado exitosamente" });
  } catch (err) {
    console.error("Error al actualizar el producto:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


const getProductsByCompanyId = async (req, res) => {
  const { company_id, page, itemsPerPage } = req.query;
  // Valida que los parámetros necesarios estén presentes
  if (!company_id || !page || !itemsPerPage) {
    return res.status(400).json({ error: "Faltan parámetros requeridos" });
  }

  const query = "CALL sp_get_products_by_company_id(?, ?, ?)";
  const values = [company_id, page, itemsPerPage];

  try {
    const [result] = await pool.query(query, values);

    // El procedimiento devuelve dos conjuntos de resultados: los productos y el total
    const products = result[0];
    const totalProducts = result[1][0].total_products;

    if (products.length === 0) {
      return res.status(404).json({
        error: "No se encontraron productos para la compañía dada",
        totalProducts: 0,
      });
    }

    res.json({ products, totalProducts });
  } catch (err) {
    console.error("Error al obtener los productos:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  insertProduct,
  updateProduct,
  deleteProduct,
  getProductsByCompanyId,
};
