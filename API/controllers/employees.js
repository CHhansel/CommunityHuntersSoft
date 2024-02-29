const pool = require("../config/db2"); 
const bcrypt = require("bcryptjs");
const saltRounds = 10; 

const createEmployee = async (req, res) => {
    const {
        company_id,
        user_name,
        email,
        role_id,
        password,
        employee_name,
        employee_lastname,
        phone_number,
        salary,
        province_code,
        canton_code,
        district_code,
        exact_address,
    } = req.body;

    try {
        // Verificar si el userName o el email ya existen en la base de datos
        const checkResults = await pool.query(
            "SELECT * FROM user WHERE user_name = ? OR email = ?",
            [user_name, email]
        );

        if (checkResults[0].length > 0) {
            // El userName o el email ya existen
            return res.status(400).json({ error: "El userName o el email ya están en uso" });
        }

        // Generar el hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Llamar al procedimiento almacenado `sp_create_employee`
        await pool.query(
            'CALL InsertEmployee(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                company_id,
                user_name,
                email,
                role_id,
                hashedPassword,
                employee_name,
                employee_lastname,
                phone_number,
                salary,
                province_code,
                canton_code,
                district_code,
                exact_address
            ]
        );

        // Consultar la vista `employee_view` para obtener el nuevo empleado
        const viewResults = await pool.query(
            "SELECT * FROM employee_view WHERE email = ?",
            [email]
        );

        if (viewResults[0].length === 0) {
            return res.status(404).json({ error: "Empleado no encontrado en la vista" });
        }

        // Devolver el nuevo empleado
        res.json({ message: "Empleado creado exitosamente", employee: viewResults[0][0] });

    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
const deleteEmployee = async (req, res) => {
    const employeeId = req.params.id;

    if (!employeeId) {
        return res.status(400).json({ error: "Falta el ID del empleado" });
    }

    try {
        const [result] = await pool.query("CALL DeleteEmployee(?)", [employeeId]);
        
        // Verificar si el procedimiento devolvió algún error
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Empleado no encontrado o ya eliminado" });
        }

        res.json({ message: "Empleado eliminado con éxito" });
    } catch (err) {
        console.error("Error al eliminar empleado:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const updateEmployee = async (req, res) => {
    const {
        employee_id,
        employee_name,
        employee_lastname,
        phone_number,
        salary,
        province_code,
        canton_code,
        district_code,
        exact_address
    } = req.body;

    // Valida que los parámetros necesarios estén presentes
    if (!employee_id || !employee_name || !employee_lastname || !phone_number || !salary || !province_code || !canton_code || !district_code || !exact_address) {
        return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }

    try {
        // Llama al procedimiento almacenado para actualizar el empleado
        const query = "CALL UpdateEmployee(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [employee_id, employee_name, employee_lastname, phone_number, salary, province_code, canton_code, district_code, exact_address];

        const [rows] = await pool.query(query, values);
        
        // Verifica si se actualizó correctamente el empleado
        if (rows.affectedRows === 0) {
            return res.status(404).json({ error: "Empleado no encontrado o no actualizado" });
        }

        res.json({ message: "Empleado actualizado exitosamente" });
    } catch (err) {
        console.error("Error al actualizar el empleado:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const getEmployeesByCompanyId = async (req, res) => {
    const { company_id, page, itemsPerPage } = req.query;
  
    // Valida que los parámetros necesarios estén presentes
    if (!company_id || !page || !itemsPerPage) {
        return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }
  
    const query = "CALL sp_get_employees_by_user_id(?, ?, ?)";
    const values = [company_id, page, itemsPerPage];
  
    try {
        const [result] = await pool.query(query, values);

        // El procedimiento devuelve dos conjuntos de resultados: los empleados y el total
        const employees = result[0];
        const totalEmployees = result[1][0].total_employees;
  
        if (employees.length === 0) {
            return res.status(404).json({ 
                error: "No se encontraron empleados para la compañía dada",
                totalEmployees: 0 
            });
        }

        res.json({ employees, totalEmployees });
    } catch (err) {
        console.error("Error al obtener los empleados:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const getEmployeesByModuleAndCompany = async (req, res) => {
    const { module_id, company_id } = req.query; // Asume que los parámetros vienen en la query de la URL

    // Verifica que ambos parámetros estén presentes
    if (!module_id || !company_id) {
        return res.status(400).json({ error: "Faltan parámetros requeridos: module_id y company_id" });
    }

    try {
        // Prepara la llamada al procedimiento almacenado
        const query = 'CALL GetEmployeesByModuleAndCompany(?, ?)';
        const values = [module_id, company_id];

        // Ejecuta la consulta en la base de datos
        const [result] = await pool.query(query, values);

        // El procedimiento puede devolver múltiples conjuntos de resultados, el primero contiene los empleados
        const employees = result[0];

        if (employees.length === 0) {
            return res.status(404).json({ message: "No se encontraron empleados para los criterios dados." });
        }

        // Devuelve los empleados encontrados
        res.json({ message: "Empleados obtenidos exitosamente", employees });
    } catch (err) {
        console.error("Error al obtener empleados:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = { createEmployee, deleteEmployee, updateEmployee, getEmployeesByCompanyId, getEmployeesByModuleAndCompany };
