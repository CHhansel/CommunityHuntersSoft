const connection = require('../config/db'); // Ajusta la ruta según la ubicación de tu archivo de conexión


const createRole = (req, res) => {
    const { name, user_id } = req.body;

    // Validar que los campos necesarios estén presentes
    if (!name || !user_id) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    // Consulta SQL para insertar un nuevo rol en la tabla user_role
    const insertQuery = 'INSERT INTO user_role (name, user__id) VALUES (?, ?)';
    const insertValues = [name, user_id];

    // Ejecutar la consulta en la base de datos
    connection.query(insertQuery, insertValues, (err, result) => {
        if (err) {
            console.error('Error al crear el rol:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        res.json({ message: 'Rol creado exitosamente' });
    });
};
const updateRole = (req, res) => {
    const { id, name, user_id } = req.body;

    // Validar que el ID y al menos uno de los campos a actualizar estén presentes
    if (!id || (!name && !user_id)) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    // Consulta SQL para actualizar un rol en la tabla user_role
    const updateQuery = 'UPDATE user_role SET name = ?, user_id = ? WHERE id = ?';
    const updateValues = [name, user_id, id];

    // Ejecutar la consulta en la base de datos
    connection.query(updateQuery, updateValues, (err, result) => {
        if (err) {
            console.error('Error al actualizar el rol:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        // Verificar si la consulta afectó alguna fila (es decir, si el ID proporcionado existe)
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        res.json({ message: 'Rol actualizado exitosamente' });
    });
};
const deleteRole = (req, res) => {
    const { id } = req.params;

    // Consulta SQL para borrar un rol de la tabla user_role
    const deleteQuery = 'DELETE FROM user_role WHERE id = ?';
    const deleteValues = [id];

    // Ejecutar la consulta en la base de datos
    connection.query(deleteQuery, deleteValues, (err, result) => {
        if (err) {
            console.error('Error al borrar el rol:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        // Verificar si la consulta afectó alguna fila (es decir, si el ID proporcionado existe)
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        res.json({ message: 'Rol borrado exitosamente' });
    });
};

const getRolesByUserId = (req, res) => {
    const { id, page, itemsPerPage } = req.query;
  
    // Valida que los parámetros necesarios estén presentes
    if (!id || !page || !itemsPerPage) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }
  
    // Llama al procedimiento almacenado para obtener los roles paginados
    const query = 'CALL sp_get_roles_by_user_id(?, ?, ?)';
    const values = [id, page, itemsPerPage];
  
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error al obtener los roles:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
   
      // El procedimiento devuelve dos conjuntos de resultados, accedemos a ellos por índice
      const roles = result[0]; // Primer conjunto de resultados
      const totalRoles = result[1][0].total_roles;
      // Devolvemos los roles paginados
      res.json({ roles, totalRoles });
    });
  };
  
  

  
  module.exports = {
    getRolesByUserId,
  };
  
module.exports = { createRole, updateRole, deleteRole, getRolesByUserId };
