
const pool = require("../config/db2");

const insertProperty = async (req, res) => {
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
        exact_address,
        province_code,
        canton_code,
        district_code,
        state,
        antiquity
    } = req.body;
    console.log(req.body);
    const query = "CALL InsertProperty(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
        exact_address,
        province_code,
        canton_code,
        district_code,
        state,
        antiquity
    ];

    try {
        await pool.query(query, values);
        res.json({ message: "Propiedad creada exitosamente" });
    } catch (err) {
        console.error("Error al insertar la propiedad:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};



const getPropertiesByCompanyId = async (req, res) => {
    const { company_id, page, itemsPerPage } = req.query;

    // Valida que los parámetros necesarios estén presentes
    if (!company_id || !page || !itemsPerPage) {
        return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }

    const query = "CALL sp_get_properties_by_company_id(?, ?, ?)";
    const values = [company_id, page, itemsPerPage];

    try {
        const [result] = await pool.query(query, values);

        // El procedimiento almacenado debería devolver dos conjuntos de resultados: las propiedades y el total
        const properties = result[0];
        const totalProperties = result[1][0].total_properties;

        if (properties.length === 0) {
            return res.status(404).json({ error: "No se encontraron propiedades para la compañía dada", totalProperties: 0 });
        }

        // Formatear las fechas
        properties.forEach(property => {
            property.antiquity = formatDate(property.antiquity);
            property.product_updated_at = formatDate(property.product_updated_at);
            property.product_created_at = formatDate(property.product_created_at);
        });
        res.json({ properties, totalProperties });
    } catch (err) {
        console.error("Error al obtener las propiedades:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
const formatDate = (dateString) => {
    if (!dateString) return null; // Retorna null si la fecha es nula o indefinida
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};
// Continuación de tu archivo de controladores

const updateProperty = async (req, res) => {
    const {
        product_id,
        product_info_id,
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
        exact_address,
        province_code,
        canton_code,
        district_code,
        state,
        antiquity
    } = req.body;
    const query = "CALL UpdateProperty(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
        product_id,
        product_info_id,
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
        exact_address,
        province_code,
        canton_code,
        district_code,
        state,
        antiquity
    ];

    try {
        await pool.query(query, values);
        res.json({ message: "Propiedad actualizada exitosamente" });
    } catch (err) {
        console.error("Error al actualizar la propiedad:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
const deleteProperty = async (req, res) => {
    const { id } = req.params; 
    console.log(req.params);
    const query = "CALL DeleteProperty(?)";
    const values = [id];

    try {
        await pool.query(query, values);
        res.json({ message: "Propiedad eliminada exitosamente" });
    } catch (err) {
        console.error("Error al eliminar la propiedad:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
module.exports = {
    insertProperty,
    getPropertiesByCompanyId,
    updateProperty,
    deleteProperty
};
