const pool = require('../config/db2');

// Controlador para insertar un rol de empresa en la tabla company_role
const insertCompanyRole = async (req, res) => {
  try {
    // Datos del rol de empresa a insertar (puedes obtenerlos del cuerpo de la solicitud)
    const { name, company_id } = req.body;

    // Realiza la inserción en la tabla company_role utilizando pool
    const query =
      'INSERT INTO company_role (name, company_id) VALUES (?, ?)';
    const values = [name, company_id];

    await pool.query(query, values);

    // Envía una respuesta exitosa
    res.json({ message: 'Rol de empresa insertado exitosamente' });
  } catch (error) {
    console.error('Error al insertar el rol de empresa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
// Controlador para obtener los módulos por el ID del rol
const getModulesByRoleId = async (req, res) => {
    try {
      const { roleId } = req.params;
  
      if (!roleId) {
        return res.status(400).json({ error: 'Falta el ID del rol' });
      }
      console.log("aaaaaaaaaaaaaaaaaaaaaa");
      // Consulta SQL para obtener todos los módulos a los que un rol tiene acceso
      const query = `
          SELECT m.*
          FROM module m
          JOIN role_access_module ram ON m.id = ram.module_id
          WHERE ram.user_role_id = ?
      `;
  
      const [modules] = await pool.query(query, [roleId]);
  
      if (modules.length === 0) {
        return res.status(404).json({ error: 'No se encontraron módulos para el rol dado' });
      }
  
      res.json({ modules });
    } catch (error) {
      console.error('Error al obtener los módulos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  const getRolesByUserId = async (req, res) => {
    const { company_id, page, itemsPerPage } = req.query;

    // Valida que los parámetros necesarios estén presentes
    if (!company_id || !page || !itemsPerPage) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }
  
    // Llama al procedimiento almacenado para obtener los roles paginados
    const query = 'CALL sp_get_roles_by_company_id(?, ?, ?)';
    const values = [company_id, page, itemsPerPage];
  
    try {
      const [result] = await pool.query(query, values);
  
      // El procedimiento devuelve dos conjuntos de resultados, accedemos a ellos por índice
      const roles = result[0]; // Primer conjunto de resultados
      const totalRoles = result[1][0].total_roles;
  
      // Devolvemos los roles paginados
      res.json({ roles, totalRoles });
    } catch (err) {
      console.error('Error al obtener los roles:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
module.exports = { insertCompanyRole, getModulesByRoleId,getRolesByUserId };
