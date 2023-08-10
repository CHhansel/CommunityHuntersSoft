
const connection = require('../config/db'); // Ajusta la ruta según la ubicación de tu archivo de conexión

// Controlador para crear un nuevo departamento
const createDepartament = (req, res) => {
    const { name, user_info_id } = req.body;
  
    // Validar que los campos necesarios estén presentes
    if (!name || !user_info_id) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }
  
    // Crear la consulta SQL para insertar el nuevo departamento en la base de datos
    const insertQuery = 'INSERT INTO departament (name, user_info_id) VALUES (?, ?)';
    const insertValues = [name, user_info_id];
  
    // Ejecutar la consulta en la base de datos
    connection.query(insertQuery, insertValues, (err, result) => {
      if (err) {
        console.error('Error al crear el departamento:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      res.json({ message: 'Departamento creado exitosamente' });
    });
  };
  
  // Controlador para actualizar un departamento existente
  const updateDepartament = (req, res) => {
    const { id, name } = req.body;
  
    // Validar que el ID y al menos uno de los campos a actualizar estén presentes
    if (!id || !name) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }
  
    // Crear la consulta SQL para actualizar el departamento en la base de datos
    const updateQuery = 'UPDATE departament SET name = ? WHERE id = ?';
    const updateValues = [name, id];
  
    // Ejecutar la consulta en la base de datos
    connection.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error('Error al actualizar el departamento:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      // Verificar si la consulta afectó alguna fila (es decir, si el ID proporcionado existe)
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Departamento no encontrado' });
      }
  
      res.json({ message: 'Departamento actualizado exitosamente' });
    });
  };
  
  // Controlador para borrar un departamento existente
  const deleteDepartament = (req, res) => {
    const { id } = req.params;
  
    // Crear la consulta SQL para borrar el departamento de la base de datos
    const deleteQuery = 'DELETE FROM departament WHERE id = ?';
  
    // Ejecutar la consulta en la base de datos
    connection.query(deleteQuery, id, (err, result) => {
      if (err) {
        console.error('Error al borrar el departamento:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      // Verificar si la consulta afectó alguna fila (es decir, si el ID proporcionado existe)
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Departamento no encontrado' });
      }
  
      res.json({ message: 'Departamento borrado exitosamente' });
    });
  };
  const getDepartaments = (req, res) => {
    const { page, itemsPerPage } = req.query;
  
    // Valida que los parámetros necesarios estén presentes
    if (!page || !itemsPerPage) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }
  
    // Calcula el offset para la paginación
    const offset = (page - 1) * itemsPerPage;
  
    // Crea la consulta SQL para obtener los departamentos paginados
    const query = 'SELECT * FROM departament LIMIT ?, ?';
    const values = [offset, itemsPerPage];
  
    // Ejecuta la consulta en la base de datos
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error al obtener los departamentos:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      // Obtiene el total de departamentos sin paginación
      connection.query('SELECT COUNT(*) AS total_departaments FROM departament', (err, countResult) => {
        if (err) {
          console.error('Error al obtener el total de departamentos:', err);
          return res.status(500).json({ error: 'Error interno del servidor' });
        }
  
        const totalDepartaments = countResult[0].total_departaments;
        const totalPages = Math.ceil(totalDepartaments / itemsPerPage);
  
        res.json({ departaments: result, totalPages, currentPage: parseInt(page), totalItems: totalDepartaments });
      });
    });
  };
  
  module.exports = { getDepartaments };
  
  module.exports = { createDepartament, updateDepartament, deleteDepartament, getDepartaments };
  