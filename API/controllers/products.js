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
        image_url
    } = req.body;
    const query = "CALL InsertProduct(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
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
        image_url
    ];

    try {
        await pool.query(query, values);
        res.json({ message: "Producto creado exitosamente" });
    } catch (err) {
        console.error("Error al insertar el producto:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM product WHERE id = ?";
    const values = [id];

    try {
        await pool.query(query, values);
        res.json({ message: "Producto eliminado exitosamente" });
    } catch (err) {
        console.error("Error al eliminar el producto:", err);
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
    insertProduct,deleteProduct, getProductsByCompanyId
};


//