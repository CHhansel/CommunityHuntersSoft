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
        category_id // Agrega el ID de la categoría desde el frontend
    } = req.body;
    console.log(req.body);
    try {
        // Iniciar una transacción
        await pool.query("START TRANSACTION");

        // Insertar el producto
        const insertProductQuery = "INSERT INTO product (internal_code, name, description, price, quantity, cabys_code, unit_of_measure, tax_rate, company_id, tax_included, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const [productResult] = await pool.query(insertProductQuery, [internal_code, name, description, price, quantity, cabys_code, unit_of_measure, tax_rate, company_id, tax_included, image_url]);

        // Obtener el ID del producto insertado
        const productId = productResult.insertId;

        // Insertar la relación entre el producto y la categoría
        const insertRelationQuery = "INSERT INTO product_category_relation (product_id, category_id, company_id) VALUES (?, ?, ?)";
        await pool.query(insertRelationQuery, [productId, category_id, company_id]);

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
        id,
        internal_code,
        name,
        description,
        price,
        quantity,
        cabys_code,
        unit_of_measure,
        tax_rate,
        tax_included
    } = req.body;

    const query = `
        UPDATE product
        SET
            internal_code = ?,
            name = ?,
            description = ?,
            price = ?,
            quantity = ?,
            cabys_code = ?,
            unit_of_measure = ?,
            tax_rate = ?,
            tax_included = ?
        WHERE
            id = ?;
    `;
    
    const values = [
        internal_code,
        name,
        description,
        parseFloat(price),
        quantity,
        cabys_code,
        unit_of_measure,
        parseFloat(tax_rate),
        tax_included,
        id
    ];

    try {
        await pool.query(query, values);
        res.json({ message: "Producto actualizado exitosamente" });
    } catch (err) {
        console.error("Error al actualizar el producto:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        // Iniciar una transacción
        await pool.query("START TRANSACTION");

        // Eliminar las relaciones de producto-categoría correspondientes al producto a eliminar
        await pool.query("DELETE FROM product_category_relation WHERE product_id = ?", [id]);

        // Eliminar el producto por su ID
        const deleteProductQuery = "DELETE FROM product WHERE id = ?";
        const [productResult] = await pool.query(deleteProductQuery, [id]);

        // Verificar si el producto fue encontrado y eliminado
        if (productResult.affectedRows === 0) {
            // Hacer rollback si el producto no fue encontrado
            await pool.query("ROLLBACK");
            return res.status(404).json({ error: "El producto no fue encontrado" });
        }

        // Confirmar la transacción si todo se ejecutó correctamente
        await pool.query("COMMIT");

        // Enviar una respuesta de éxito
        res.json({ message: "Producto y relaciones eliminadas exitosamente" });
    } catch (err) {
        // Hacer rollback en caso de error
        await pool.query("ROLLBACK");

        console.error("Error al eliminar el producto y sus relaciones:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


const getProductsByCompanyId = async (req, res) => {
    const { company_id, page, itemsPerPage } = req.query;
     console.log(req.query);
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
                totalProducts: 0 
            });
        }

        res.json({ products, totalProducts });
    } catch (err) {
        console.error("Error al obtener los productos:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = {
    insertProduct,updateProduct, deleteProduct, getProductsByCompanyId
};
