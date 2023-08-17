const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const connection = require('../config/db'); // Ajusta la ruta según la ubicación de tu archivo de conexión

const saltRounds = 10; // Número de rondas de sal utilizadas para el hash de la contraseña
const secretKey = process.env.BCRIPT_KEY; // Clave secreta para el hash de la contraseña y los tokens de autenticación

const createUser = (req, res) => {
    const { companyName, username, email, role, password, name, lastname, phoneNumber, faxNumber, accountState, province, canton, district, exactAddress, commercialActivity, registrationDate } = req.body;

    // Verificar si el username o el email ya existen en la base de datos
    const checkQuery = 'SELECT * FROM user WHERE user_name = ? OR email = ?';
    const checkValues = [username, email];
    connection.query(checkQuery, checkValues, (checkErr, checkResults) => {
        if (checkErr) {
            console.error('Error al verificar la existencia de usuario:', checkErr);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (checkResults.length > 0) {
            // El username o el email ya existen
            return res.status(400).json({ error: 'El username o el email ya están en uso' });
        }

        // Generar el hash de la contraseña
        bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
            if (hashErr) {
                console.error('Error al generar el hash de la contraseña:', hashErr);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            // Crear la consulta SQL para llamar al procedimiento almacenado `create_user_procedure`
            const procedureQuery = `CALL sp_create_user(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
            const procedureValues = [companyName, username, email, role, hashedPassword, name,
                lastname, phoneNumber, faxNumber, accountState, province, canton, district,
                exactAddress, commercialActivity, registrationDate];

            // Ejecutar la consulta en la base de datos
            connection.query(procedureQuery, procedureValues, (procedureErr, procedureResult) => {
                if (procedureErr) {
                    console.error('Error al crear usuario:', procedureErr.sqlMessage);
                    return res.status(500).json({ error: 'Error interno del servidor' });
                }

                res.json({ message: 'Usuario creado exitosamente' });
            });
        });
    });
};


module.exports = createUser;


const login = (req, res) => {
  const { username, password } = req.body;

  // Consulta SQL para obtener el usuario por el nombre de usuario
  const userQuery = 'SELECT * FROM user WHERE user_name = ?';
  const userValues = [username];

  // Ejecutar la consulta en la base de datos
  connection.query(userQuery, userValues, (userErr, userResults) => {
      if (userErr) {
          console.error('Error al obtener el usuario:', userErr);
          return res.status(500).json({ error: 'Error interno del servidor' });
      }

      // Verificar si se encontró el usuario
      if (userResults.length === 0) {
          return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const user = userResults[0]; // Obtener el primer usuario de los resultados

      // Verificar la contraseña
      bcrypt.compare(password, user.password, (compareErr, isMatch) => {
          if (compareErr) {
              console.error('Error al verificar la contraseña:', compareErr);
              return res.status(500).json({ error: 'Error interno del servidor' });
          }

          if (!isMatch) {
              return res.status(401).json({ error: 'Credenciales inválidas' });
          }

          // Actualizar el campo last_login con la fecha y hora actual
          const lastLoginQuery = 'UPDATE user SET last_login = NOW() WHERE id = ?';
          const lastLoginValues = [user.id];
          connection.query(lastLoginQuery, lastLoginValues, (updateErr, updateResult) => {
              if (updateErr) {
                  console.error('Error al actualizar el last_login:', updateErr);
                  return res.status(500).json({ error: 'Error interno del servidor' });
              }

              // Consulta SQL para obtener los datos del usuario desde la vista user_view
              const userInfoQuery = 'SELECT * FROM user_view WHERE id = ?';
              const userInfoValues = [user.id];
              connection.query(userInfoQuery, userInfoValues, (userInfoErr, userInfoResults) => {
                  if (userInfoErr) {
                      console.error('Error al obtener los datos del usuario:', userInfoErr);
                      return res.status(500).json({ error: 'Error interno del servidor' });
                  }

                  const userInfo = userInfoResults[0]; // Obtener los datos del usuario de los resultados

                  // Generar el token de autenticación (Duracion 12 horas)
                  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '12h' });

                  res.json({ user: userInfo, token });
              });
          });
      });
  });
};

module.exports = { login };

const updateUser = (req, res) => {
    const { userId } = req;
    const {
        name,
        lastname,
        phone_number,
        fax_number,
        province,
        canton,
        district,
        exact_address,
        commercial_activity,
    } = req.body;

    // Actualizar la información del usuario en la base de datos
    const query = `CALL update_user_procedure(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        userId,
        name,
        lastname,
        phone_number,
        fax_number,
        province,
        canton,
        district,
        exact_address,
        commercial_activity,
    ];

    connection.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al actualizar la información del usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        res.json({ message: 'Información de usuario actualizada exitosamente' });
    });
};
const getUsersPaged = (req, res) => {
    const { page, itemsPerPage } = req.query;
  
    // Valida que los parámetros necesarios estén presentes
    if (!page || !itemsPerPage) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }
  
    // Llama al procedimiento almacenado para obtener los datos paginados
    const query = 'CALL sp_get_users_paged(?, ?)';
    const values = [page, itemsPerPage];
  
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error al obtener los datos:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      // Los datos paginados se encuentran en la primera posición del resultado
      const users = result[0];
  
      // Verifica si se obtuvieron datos
      if (users.length === 0) {
        return res.status(404).json({ error: 'No se encontraron datos' });
      }
  
      // Devuelve los datos paginados
      res.json({ users });
    });
  };

  const createDniType = (req, res) => {
    const { name } = req.body; // Obtiene el nombre del tipo de DNI desde el cuerpo de la solicitud
  
    // Validar que el nombre del tipo de DNI esté presente
    if (!name) {
      return res.status(400).json({ error: 'Falta el nombre del tipo de DNI' });
    }
  
    // Crear la consulta SQL para insertar un nuevo tipo de DNI en la tabla `dni_type`
    const insertQuery = 'INSERT INTO dni_type (name) VALUES (?)';
    const insertValues = [name];
  
    // Ejecutar la consulta en la base de datos
    connection.query(insertQuery, insertValues, (err, result) => {
      if (err) {
        console.error('Error al crear el tipo de DNI:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      // El tipo de DNI se creó correctamente
      res.json({ message: 'Tipo de DNI creado exitosamente', dniTypeId: result.insertId });
    });
  };
  const getDniTypes = (req, res) => {
    // Crear la consulta SQL para obtener todos los tipos de DNI de la tabla `dni_type`
    const selectQuery = 'SELECT * FROM dni_type';
  
    // Ejecutar la consulta en la base de datos
    connection.query(selectQuery, (err, result) => {
      if (err) {
        console.error('Error al obtener los tipos de DNI:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      // Verifica si se obtuvieron tipos de DNI
      if (result.length === 0) {
        return res.status(404).json({ error: 'No se encontraron tipos de DNI' });
      }
  
      // Devuelve los tipos de DNI
      res.json({ dniTypes: result });
    });
  };
  
module.exports = { login, createUser, updateUser,getUsersPaged,createDniType,getDniTypes };
