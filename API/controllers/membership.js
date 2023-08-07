
const connection = require('../config/db'); // Ajusta la ruta según la ubicación de tu archivo de conexión


const createMembership = (req, res) => {
    const { name, price, duration, description } = req.body;
  
    // Crear la consulta SQL para insertar una nueva membresía en la tabla `memberships`
    const insertQuery = 'INSERT INTO memberships (name, price, duration, description) VALUES (?, ?, ?, ?)';
    const insertValues = [name, price, duration, description];
  
    // Ejecutar la consulta en la base de datos
    connection.query(insertQuery, insertValues, (err, result) => {
      if (err) {
        console.error('Error al crear la membresía:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      // La membresía se creó correctamente
      res.json({ message: 'Membresía creada exitosamente', membershipId: result.insertId });
    });
  };
  
  const getMemberships = (req, res) => {
    // Crear la consulta SQL para obtener todas las membresías de la tabla `memberships`
    const query = 'SELECT * FROM memberships';
  
    // Ejecutar la consulta en la base de datos
    connection.query(query, (err, result) => {
      if (err) {
        console.error('Error al obtener las membresías:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      // Verifica si se obtuvieron membresías
      if (result.length === 0) {
        return res.status(404).json({ error: 'No se encontraron membresías' });
      }
  
      // Devuelve todas las membresías encontradas
      res.json({ memberships: result });
    });
  };
  const updateMembership = (req, res) => {
    const { id } = req.params; // Obtiene el ID de la membresía a actualizar desde los parámetros de la URL
    const { name, price, duration, description } = req.body; // Obtiene los nuevos datos de la membresía desde el cuerpo de la solicitud
  
    // Crear la consulta SQL para actualizar la membresía en la base de datos
    const updateQuery = 'UPDATE memberships SET name = ?, price = ?, duration = ?, description = ? WHERE id = ?';
    const updateValues = [name, price, duration, description, id];
  
    // Ejecutar la consulta en la base de datos
    connection.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error('Error al actualizar la membresía:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Membresía no encontrada' });
      }
  
      res.json({ message: 'Membresía actualizada exitosamente' });
    });
  };
  const deleteMembership = (req, res) => {
    const { id } = req.params; // Obtiene el ID de la membresía a borrar desde los parámetros de la URL
  
    // Crear la consulta SQL para borrar la membresía de la base de datos
    const deleteQuery = 'DELETE FROM memberships WHERE id = ?';
    const deleteValues = [id];
  
    // Ejecutar la consulta en la base de datos
    connection.query(deleteQuery, deleteValues, (err, result) => {
      if (err) {
        console.error('Error al borrar la membresía:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Membresía no encontrada' });
      }
  
      res.json({ message: 'Membresía borrada exitosamente' });
    });
  };
  
  const createUserMembership = (req, res) => {
    const { user_info_id, membership_id, start_date, end_date, active } = req.body;
  
    // Validar que los campos necesarios estén presentes
    if (!user_info_id || !membership_id || !start_date || !end_date || active === undefined) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }
  
    // Llamar al procedimiento almacenado para crear el user_membership
    const createQuery = 'CALL sp_create_user_membership(?, ?, ?, ?, ?)';
    const createValues = [user_info_id, membership_id, start_date, end_date, active];
  
    connection.query(createQuery, createValues, (err, result) => {
      if (err) {
        console.error('Error al crear el user_membership:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      res.json({ message: 'User membership creado exitosamente' });
    });
  };
  const updateUserMembership = (req, res) => {
    const { id, user_info_id, membership_id, start_date, end_date, active } = req.body;
  
    // Validar que el ID y al menos uno de los campos a actualizar estén presentes
    if (!id || (!user_info_id && !membership_id && !start_date && !end_date && active === undefined)) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }
  
    // Llamar al procedimiento almacenado para actualizar el user_membership
    const updateQuery = 'CALL sp_update_user_membership(?, ?, ?, ?, ?, ?)';
    const updateValues = [id, user_info_id, membership_id, start_date, end_date, active];
  
    connection.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error('Error al actualizar el user_membership:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      // Verificar si el procedimiento afectó alguna fila (es decir, si el ID proporcionado existe)
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User membership no encontrado' });
      }
  
      res.json({ message: 'User membership actualizado exitosamente' });
    });
  };
  module.exports = {
    createMembership,getMemberships,updateMembership,deleteMembership,createUserMembership,updateUserMembership
  };
  