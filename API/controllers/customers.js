const pool = require("../config/db2");


const getCustomersByUserId = async (req, res) => {
    const { company_id, page, itemsPerPage } = req.query;

    // Valida que los parámetros necesarios estén presentes
    if (!company_id || !page || !itemsPerPage) {
        return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }

    const query = "CALL sp_get_customers_by_user_id(?, ?, ?)";
    const values = [company_id, page, itemsPerPage];

    try {
        const [result] = await pool.query(query, values);

        // El procedimiento almacenado debería devolver dos conjuntos de resultados: los clientes y el total
        const customers = result[0];
        const totalCustomers = result[1][0].total_customers;

        if (customers.length === 0) {
            return res.status(404).json({ 
                error: "No se encontraron clientes para el usuario dado",
                totalCustomers: 0 
            });
        }

        res.json({ customers, totalCustomers });
    } catch (err) {
        console.error("Error al obtener los clientes:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
const createCustomer = async (req, res) => {
    const { name, lastname, dni, dni_type, email, company_id, note, exact_address, province_code, canton_code, district_code } = req.body;
    console.log(name, lastname, dni, dni_type, email, company_id, note, exact_address, province_code, canton_code, district_code);
    // Valida que los parámetros necesarios estén presentes
    if (!name || !lastname || !dni || !dni_type || !email || !company_id || !exact_address || !province_code || !canton_code || !district_code) {
        return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }

    const query = "CALL InsertCustomer(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [name, lastname, dni, dni_type, email, company_id, note, exact_address, province_code, canton_code, district_code];

    try {
        await pool.query(query, values);
        res.status(201).json({ message: "Cliente creado con éxito" });
    } catch (err) {
        console.error("Error al crear el cliente:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
const deleteCustomer = async (req, res) => {
    const { id } = req.params;
    const query = "CALL DeleteCustomer(?)";
    const values = [id];
  
    try {
        await pool.query(query, values);
        res.json({ message: "Cliente eliminado con éxito" });
    } catch (err) {
        console.error("Error al eliminar el cliente:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
const updateCustomer = async (req, res) => {
    const { 
        customer_id, // ID del cliente a actualizar
        name, 
        lastname, 
        dni, 
        dni_type, 
        email, 
        company_id, 
        note, 
        exact_address, 
        province_code, 
        canton_code, 
        district_code 
    } = req.body;

    // Valida que los parámetros necesarios estén presentes
    if (!customer_id || !name || !lastname || !dni || !dni_type || !email || !company_id || !exact_address || !province_code || !canton_code || !district_code) {
        return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }

    const query = "CALL UpdateCustomer(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [customer_id, name, lastname, dni, dni_type, email, company_id, note, exact_address, province_code, canton_code, district_code];

    try {
        await pool.query(query, values);
        res.status(200).json({ message: "Cliente actualizado con éxito" });
    } catch (err) {
        console.error("Error al actualizar el cliente:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
module.exports = { createCustomer, getCustomersByUserId, deleteCustomer, updateCustomer };