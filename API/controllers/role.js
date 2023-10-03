const connection = require('../config/db'); // Ajusta la ruta según la ubicación de tu archivo de conexión


const createRole = (req, res) => {
    const { name, moduleIds, user_id } = req.body;

    // Validar que los campos necesarios estén presentes
    if (!name || !user_id || !moduleIds || moduleIds.length === 0) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    // Consulta SQL para insertar un nuevo rol en la tabla user_role
    const insertRoleQuery = 'INSERT INTO user_role (name, user_id) VALUES (?, ?)';
    const insertValues = [name, user_id];

    // Ejecutar la consulta en la base de datos
    connection.query(insertRoleQuery, insertValues, (err, result) => {
        if (err) {
            console.error('Error al crear el rol:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        // Una vez que el rol ha sido creado, obtenemos el ID del rol insertado
        const insertedRoleId = result.insertId;

        // Ahora, insertamos los permisos en la tabla role_access_module
        const insertPermissionsQuery = 'INSERT INTO role_access_module (module_id, user_role_id) VALUES ?';
        const permissionsValues = moduleIds.map(moduleId => [moduleId, insertedRoleId]);

        connection.query(insertPermissionsQuery, [permissionsValues], (err, result) => {
            if (err) {
                console.error('Error al insertar los permisos:', err);
                return res.status(500).json({ error: 'Error interno del servidor al insertar permisos' });
            }

            res.json({ message: 'Rol y permisos creados exitosamente' });
        });
    });
};
const getAccessibleModulesByRoleId = (req, res) => {
    const { role_id } = req.params;

    // Validar que el role_id esté presente
    if (!role_id) {
        return res.status(400).json({ error: 'Falta el role_id en los parámetros' });
    }

    // Consulta SQL para obtener todos los módulos accesibles asociados a un role_id
    const selectQuery = `
        SELECT m.* 
        FROM module AS m
        JOIN role_access_module AS ram ON m.id = ram.module_id
        WHERE ram.company_id = ?
    `;

    // Ejecutar la consulta en la base de datos
    connection.query(selectQuery, [role_id], (err, results) => {
        if (err) {
            console.error('Error al obtener los módulos accesibles:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        res.json({ accessibleModules: results });
    });
};
const updateRole = (req, res) => {
    const { id, name, moduleIds } = req.body;
 console.log(req.body);
    if (!id || !name || !moduleIds || moduleIds.length === 0) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    // Paso 1: Actualizar el nombre del rol
    const updateRoleQuery = 'UPDATE company_rol SET name = ? WHERE id = ?';
    connection.query(updateRoleQuery, [name, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el rol:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        // Paso 2: Obtener todos los module_id asociados al user_role_id
        const selectPermissionsQuery = 'SELECT module_id FROM role_access_module WHERE company_id = ?';
        connection.query(selectPermissionsQuery, [id], (err, existingModules) => {
            if (err) {
                console.error('Error al obtener los permisos existentes:', err);
                return res.status(500).json({ error: 'Error interno del servidor al obtener permisos' });
            }

            const existingModuleIds = existingModules.map(module => module.module_id);

            // Paso 3 y 4: Determinar qué permisos eliminar
            const modulesToDelete = existingModuleIds.filter(moduleId => !moduleIds.includes(moduleId));
            if (modulesToDelete.length > 0) {
                const deletePermissionsQuery = 'DELETE FROM role_access_module WHERE user_role_id = ? AND module_id IN (?)';
                connection.query(deletePermissionsQuery, [id, modulesToDelete], (err, result) => {
                    if (err) {
                        console.error('Error al eliminar permisos:', err);
                        return res.status(500).json({ error: 'Error interno del servidor al eliminar permisos' });
                    }
                });
            }

            // Paso 5: Determinar qué permisos insertar
            const modulesToAdd = moduleIds.filter(moduleId => !existingModuleIds.includes(moduleId));
            if (modulesToAdd.length > 0) {
                const insertPermissionsQuery = 'INSERT INTO role_access_module (module_id, user_role_id) VALUES ?';
                const permissionsValues = modulesToAdd.map(moduleId => [moduleId, id]);
                connection.query(insertPermissionsQuery, [permissionsValues], (err, result) => {
                    if (err) {
                        console.error('Error al insertar nuevos permisos:', err);
                        return res.status(500).json({ error: 'Error interno del servidor al insertar nuevos permisos' });
                    }
                });
            }
            const getUpdatedRoleQuery = 'SELECT * FROM user_role WHERE id = ?';
            connection.query(getUpdatedRoleQuery, [id], (err, updatedRole) => {
                if (err) {
                    console.error('Error al obtener el rol modificado:', err);
                    return res.status(500).json({ error: 'Error interno del servidor al obtener el rol modificado' });
                }
        
                const getUpdatedPermissionsQuery = 'SELECT module_id FROM role_access_module WHERE user_role_id = ?';
                connection.query(getUpdatedPermissionsQuery, [id], (err, updatedPermissions) => {
                    if (err) {
                        console.error('Error al obtener los permisos del rol modificado:', err);
                        return res.status(500).json({ error: 'Error interno del servidor al obtener los permisos del rol modificado' });
                    }
        
                    // Devuelve el rol modificado y sus permisos
                    res.json({
                        message: 'Rol y permisos actualizados exitosamente',
                        updatedRole: updatedRole[0], // Suponiendo que user_role.id es una clave primaria y la consulta devuelve un solo resultado
                        updatedPermissions: updatedPermissions.map(permission => permission.module_id)
                    });
                });
            });
            
        });
    });
};
// const updateRole = (req, res) => {
//     const { id, name, moduleIds } = req.body;
//     console.log(req.body);

//     if (!id || !name || !moduleIds || moduleIds.length === 0) {
//         return res.status(400).json({ error: 'Faltan parámetros requeridos' });
//     }

//     // Paso 1: Actualizar el nombre del rol
//     const updateRoleQuery = 'UPDATE user_role SET name = ? WHERE id = ?';
//     connection.query(updateRoleQuery, [name, id], (err, result) => {
//         if (err) {
//             console.error('Error al actualizar el rol:', err);
//             return res.status(500).json({ error: 'Error interno del servidor' });
//         }

//         // Paso 2: Obtener todos los module_id asociados al user_role_id
//         const selectPermissionsQuery = 'SELECT module_id FROM role_access_module WHERE user_role_id = ?';
//         connection.query(selectPermissionsQuery, [id], (err, existingModules) => {
//             if (err) {
//                 console.error('Error al obtener los permisos existentes:', err);
//                 return res.status(500).json({ error: 'Error interno del servidor al obtener permisos' });
//             }

//             const existingModuleIds = existingModules.map(module => module.module_id);

//             // Paso 3 y 4: Determinar qué permisos eliminar
//             const modulesToDelete = existingModuleIds.filter(moduleId => !moduleIds.includes(moduleId));
//             if (modulesToDelete.length > 0) {
//                 const deletePermissionsQuery = 'DELETE FROM role_access_module WHERE user_role_id = ? AND module_id IN (?)';
//                 connection.query(deletePermissionsQuery, [id, modulesToDelete], (err, result) => {
//                     if (err) {
//                         console.error('Error al eliminar permisos:', err);
//                         return res.status(500).json({ error: 'Error interno del servidor al eliminar permisos' });
//                     }
//                 });
//             }

//             // Paso 5: Determinar qué permisos insertar
//             const modulesToAdd = moduleIds.filter(moduleId => !existingModuleIds.includes(moduleId));
//             if (modulesToAdd.length > 0) {
//                 const insertPermissionsQuery = 'INSERT INTO role_access_module (module_id, user_role_id) VALUES ?';
//                 const permissionsValues = modulesToAdd.map(moduleId => [moduleId, id]);
//                 connection.query(insertPermissionsQuery, [permissionsValues], (err, result) => {
//                     if (err) {
//                         console.error('Error al insertar nuevos permisos:', err);
//                         return res.status(500).json({ error: 'Error interno del servidor al insertar nuevos permisos' });
//                     }

//                     // Paso 6: Obtener el rol modificado y sus permisos
//                     const getUpdatedRoleQuery = 'SELECT * FROM user_role WHERE id = ?';
//                     connection.query(getUpdatedRoleQuery, [id], (err, updatedRole) => {
//                         if (err) {
//                             console.error('Error al obtener el rol modificado:', err);
//                             return res.status(500).json({ error: 'Error interno del servidor al obtener el rol modificado' });
//                         }

//                         const getUpdatedPermissionsQuery = 'SELECT module_id FROM role_access_module WHERE user_role_id = ?';
//                         connection.query(getUpdatedPermissionsQuery, [id], (err, updatedPermissions) => {
//                             if (err) {
//                                 console.error('Error al obtener los permisos del rol modificado:', err);
//                                 return res.status(500).json({ error: 'Error interno del servidor al obtener los permisos del rol modificado' });
//                             }

//                             // Devuelve el rol modificado y sus permisos
//                             console.log();
//                             res.json({
//                                 message: 'Rol y permisos actualizados exitosamente',
//                                 updatedRole: updatedRole[0], // Suponiendo que user_role.id es una clave primaria y la consulta devuelve un solo resultado
//                                 updatedPermissions: updatedPermissions.map(permission => permission.module_id)
//                             });
//                         });
//                     });
//                 });
//             }
//         });
//     });
// };


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
    const { user_id, company_id, page, itemsPerPage } = req.query;
  
    // Valida que los parámetros necesarios estén presentes
    if (!user_id || !page || !itemsPerPage) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }
  
    // Llama al procedimiento almacenado para obtener los roles paginados
    const query = 'CALL sp_get_roles_by_user_id(?, ?, ?)';
    const values = [company_id, page, itemsPerPage];
  
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
  const getModulesByRoleId = (req, res) => {
    const { roleId } = req.params;

    if (!roleId) {
        return res.status(400).json({ error: 'Falta el ID del rol' });
    }

    // Consulta SQL para obtener todos los módulos a los que un rol tiene acceso
    const query = `
        SELECT m.*
        FROM module m
        JOIN role_access_module ram ON m.id = ram.module_id
        WHERE ram.user_role_id = ?
    `;

    connection.query(query, [roleId], (err, modules) => {
        if (err) {
            console.error('Error al obtener los módulos:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (modules.length === 0) {
            return res.status(404).json({ error: 'No se encontraron módulos para el rol dado' });
        }

        res.json({ modules });
    });
};

  
module.exports = { createRole, updateRole, deleteRole, getRolesByUserId, getAccessibleModulesByRoleId,getModulesByRoleId };
