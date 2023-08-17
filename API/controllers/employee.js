
const connection = require('../config/db'); // Ajusta la ruta según la ubicación de tu archivo de conexión


const createEmployeeRol = (req, res) => {
    const { employee_info_id, name } = req.body;

    // Validar que los campos necesarios estén presentes
    if (!employee_info_id || !name) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    // Crear la consulta SQL para insertar el nuevo elemento en la tabla
    const createQuery = 'INSERT INTO employee_rol (employee_info_id, name) VALUES (?, ?)';
    const createValues = [employee_info_id, name];

    // Ejecutar la consulta en la base de datos
    connection.query(createQuery, createValues, (err, result) => {
        if (err) {
            console.error('Error al crear el elemento en employee_rol:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        // Devolver el ID del elemento recién creado
        const newElementId = result.insertId;
        res.json({ message: 'Elemento creado exitosamente', newElementId });
    });
};
const deleteEmployeeRol = (req, res) => {
    const { id } = req.params; // Obtiene el ID del elemento a borrar desde los parámetros de la URL

    // Validar que el ID esté presente
    if (!id) {
        return res.status(400).json({ error: 'Falta el parámetro de ID' });
    }

    // Crear la consulta SQL para borrar el elemento de la tabla
    const deleteQuery = 'DELETE FROM employee_rol WHERE id = ?';
    const deleteValue = [id];

    // Ejecutar la consulta en la base de datos
    connection.query(deleteQuery, deleteValue, (err, result) => {
        if (err) {
            console.error('Error al borrar el elemento en employee_rol:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        // Verificar si el elemento existía en la tabla
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Elemento no encontrado' });
        }

        res.json({ message: 'Elemento borrado exitosamente' });
    });
};
const updateEmployeeRol = (req, res) => {
    const { id } = req.params; // Obtiene el ID del elemento a actualizar desde los parámetros de la URL
    const { name } = req.body; // Obtiene el nuevo nombre desde el cuerpo de la solicitud

    // Validar que el ID y al menos uno de los campos a actualizar estén presentes
    if (!id || !name) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    // Crear la consulta SQL para actualizar el campo "name" del elemento en la base de datos
    const updateQuery = 'UPDATE employee_rol SET name = ? WHERE id = ?';
    const updateValues = [name, id];

    // Ejecutar la consulta en la base de datos
    connection.query(updateQuery, updateValues, (err, result) => {
        if (err) {
            console.error('Error al actualizar el elemento en employee_rol:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        // Verificar si el elemento existía en la tabla
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Elemento no encontrado' });
        }

        res.json({ message: 'Elemento actualizado exitosamente' });
    });
};
const connection = require('../db/connection');

const getEmployeeRolByUserInfoId = (req, res) => {
    const { user_info_id, page, itemsPerPage } = req.query;

    // Valida que los parámetros necesarios estén presentes
    if (!user_info_id || !page || !itemsPerPage) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    // Llama al procedimiento almacenado para obtener los EmployeeRol paginados
    const query = 'CALL sp_get_employee_rol_by_user_info_id(?, ?, ?)';
    const values = [user_info_id, page, itemsPerPage];

    connection.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al obtener los EmployeeRol:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        // El procedimiento devuelve un conjunto de resultados
        const employeeRol = result[0];

        // También podemos obtener el total de EmployeeRol sin paginación
        const totalEmployeeRol = result[1][0].total_employee_rol;

        // Verifica si se obtuvieron EmployeeRol
        if (employeeRol.length === 0) {
            return res.status(404).json({ error: 'No se encontraron EmployeeRol para el user_info_id dado' });
        }

        // Devuelve los EmployeeRol paginados y el total de EmployeeRol sin paginación
        res.json({ employeeRol, totalEmployeeRol });
    });
};


module.exports = { createEmployeeRol, deleteEmployeeRol, updateEmployeeRol, getEmployeeRolByUserInfoId  };
