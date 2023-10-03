const bcrypt = require("bcryptjs");
const connection = require('../config/db'); // Ajusta la ruta según la ubicación de tu archivo de conexión

const saltRounds = 10; // Número de rondas de sal utilizadas para el hash de la contraseña
const createEmployee = (req, res) => {
    const {
        company_name,
        user_name,
        email,
        role_id,
        password,
        employee_name,
        employee_lastname,
        phone_number,
        salary,
        province,
        canton,
        district,
        exact_address,
        client_id
    } = req.body;

    // Verificar si el userName o el email ya existen en la base de datos
    const checkQuery = "SELECT * FROM user WHERE user_name = ? OR email = ?";
    const checkValues = [user_name, email];
    connection.query(checkQuery, checkValues, (checkErr, checkResults) => {
        if (checkErr) {
            console.error("Error al verificar la existencia del empleado:", checkErr);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        if (checkResults.length > 0) {
            // El userName o el email ya existen
            return res.status(400).json({ error: "El userName o el email ya están en uso" });
        }

        // Generar el hash de la contraseña
        bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
            if (hashErr) {
                console.error("Error al generar el hash de la contraseña:", hashErr);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            // Crear la consulta SQL para llamar al procedimiento almacenado `sp_create_employee`
            const procedureQuery = 'CALL sp_create_employee(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const procedureValues = [
                company_name,
                user_name,
                email,
                role_id,
                hashedPassword,
                employee_name,
                employee_lastname,
                phone_number,
                salary,
                province,
                canton,
                district,
                exact_address,
                client_id
            ];

            // Ejecutar la consulta en la base de datos
            connection.query(procedureQuery, procedureValues, (procedureErr, procedureResult) => {
                if (procedureErr) {
                    console.error("Error al crear empleado:", procedureErr);
                    return res.status(500).json({ error: "Error interno del servidor" });
                }

                // Consulta a la vista `employee_view` para obtener el nuevo empleado
                const viewQuery = "SELECT * FROM employee_view WHERE email = ?";
                connection.query(viewQuery, [email], (viewErr, viewResults) => {
                    if (viewErr) {
                        console.error("Error al obtener el empleado desde la vista:", viewErr);
                        return res.status(500).json({ error: "Error interno del servidor" });
                    }

                    if (viewResults.length === 0) {
                        return res.status(404).json({ error: "Empleado no encontrado en la vista" });
                    }

                    // Devolver el nuevo empleado
                    res.json({ message: "Empleado creado exitosamente", employee: viewResults[0] });
                });
            });
        });
    });
};
const updateEmployee = (req, res) => {
    const {
        employee_user_id,
        company_name,
        email,
        role_id,
        employee_name,
        employee_lastname,
        phone_number,
        salary,
        province,
        canton,
        district,
        exact_address,
        client_id
    } = req.body;

    // Crear la consulta SQL para llamar al procedimiento almacenado `sp_update_employee`
    const procedureQuery = 'CALL sp_update_employee( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const procedureValues = [
        employee_user_id,
        company_name,
        email,
        role_id,
        employee_name,
        employee_lastname,
        phone_number,
        salary,
        province,
        canton,
        district,
        exact_address,
        client_id
    ];
    // Ejecutar la consulta en la base de datos
    connection.query(procedureQuery, procedureValues, (procedureErr, procedureResult) => {
        if (procedureErr) {
            console.error("Error al actualizar empleado:", procedureErr);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        // Consulta a la vista `employee_view` para obtener el empleado actualizado
        const viewQuery = "SELECT * FROM employee_view WHERE email = ?";
        connection.query(viewQuery, [email], (viewErr, viewResults) => {
            if (viewErr) {
                console.error("Error al obtener el empleado desde la vista:", viewErr);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            if (viewResults.length === 0) {
                return res.status(404).json({ error: "Empleado no encontrado en la vista" });
            }

            // Devolver el empleado actualizado
            res.json({ message: "Empleado actualizado exitosamente", employee: viewResults[0] });
        });
    });
};

const getEmployeesByUserId = (req, res) => {
    const { user_id, page, itemsPerPage } = req.query;
  
    // Valida que los parámetros necesarios estén presentes
    if (!user_id || !page || !itemsPerPage) {
      return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }
  
    // Llama al procedimiento almacenado para obtener los empleados paginados
    const query = "CALL sp_get_employees_by_user_id(?, ?, ?)";
    const values = [user_id, page, itemsPerPage];
  
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error("Error al obtener los empleados:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }
  
      // El procedimiento devuelve un conjunto de resultados, accedemos a la primera posición para obtener los empleados
      const employees = result[0];
  
      // También podemos obtener el total de empleados sin paginación
      const totalEmployees = result[1][0].total_employees;
  
      // Verifica si se obtuvieron empleados
      if (employees.length === 0) {
        return res
          .status(404)
          .json({ error: "No se encontraron empleados para el usuario dado" });
      }
  
      // Si deseas realizar alguna transformación adicional a los empleados, puedes hacerlo aquí
      // Por ejemplo, si deseas eliminar el user_id de cada empleado:
      employees.map((employee) => {
        delete employee.id;
        return employee;
      });
  
      // Devuelve los empleados paginados y el total de empleados sin paginación
      res.json({ employees, totalEmployees });
    });
  };
   
module.exports = {getEmployeesByUserId, createEmployee, updateEmployee };
