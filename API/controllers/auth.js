const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const connection = require('../config/db'); // Ajusta la ruta según la ubicación de tu archivo de conexión

const saltRounds = 10; // Número de rondas de sal utilizadas para el hash de la contraseña
const secretKey = process.env.BCRIPT_KEY; // Clave secreta para el hash de la contraseña y los tokens de autenticación

const createUser = (req, res) => {
    const { companyName, username, email, rol, password, name, lastname, phoneNumber, faxNumber, accountState, province, canton, district, exactAddress, commercialActivity, registrationDate } = req.body;

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
            const procedureQuery = `CALL create_user_procedure(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
            const procedureValues = [companyName, username, email, rol, hashedPassword, name,
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
    const query = 'SELECT * FROM user WHERE user_name = ?';
    const values = [username];

    // Ejecutar la consulta en la base de datos
    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error al obtener el usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        // Verificar si se encontró el usuario
        if (results.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = results[0]; // Obtener el primer usuario de los resultados

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

                // Generar el token de autenticación (Duracion 12 horas)
                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '12h' });


                res.json({ token });
            });
        });
    });
};

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
module.exports = { login, createUser, updateUser };
