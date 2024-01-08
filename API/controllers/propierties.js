
const pool = require("../config/db2");

const insertProperty = async (req, res) => {
    const {
        internalCode,
        name,
        description,
        price,
        quantity,
        cabysCode,
        unitOfMeasure,
        taxRate,
        companyId,
        taxIncluded,
        exactAddress,
        provinceCode,
        cantonCode,
        districtCode,
        state,
        antiquity
    } = req.body;

    const query = "CALL InsertProperty(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
        internalCode,
        name,
        description,
        price,
        quantity,
        cabysCode,
        unitOfMeasure,
        taxRate,
        companyId,
        taxIncluded,
        exactAddress,
        provinceCode,
        cantonCode,
        districtCode,
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
    const { companyId, page, itemsPerPage } = req.query;

    // Valida que los parámetros necesarios estén presentes
    if (!companyId || !page || !itemsPerPage) {
        return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }

    const query = "CALL sp_get_properties_by_company_id(?, ?, ?)";
    const values = [companyId, page, itemsPerPage];

    try {
        const [result] = await pool.query(query, values);

        // El procedimiento almacenado debería devolver dos conjuntos de resultados: las propiedades y el total
        const properties = result[0];
        const totalProperties = result[1][0].total_properties;

        if (properties.length === 0) {
            return res.status(404).json({ error: "No se encontraron propiedades para la compañía dada", totalProperties: 0 });
        }

        // Formatear fechas si es necesario
        // ...
        //propertiesFormatDate = formatCreationDateInArray(properties);
        res.json({ properties, totalProperties });
    } catch (err) {
        console.error("Error al obtener las propiedades:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = {
    insertProperty,
    getPropertiesByCompanyId
};
