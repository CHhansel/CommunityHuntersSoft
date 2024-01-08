
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const connection = require("../config/db"); // Ajusta la ruta según la ubicación de tu archivo de conexión
const pool = require("../config/db2");


const getCompanyCredentialsByCompanyId = (req, res) => {
    const { company_id } = req.params; // Obteniendo el company_id desde los parámetros de la ruta

    // Verificar si el company_id es válido
    if (!company_id) {
        return res.status(400).json({ error: "company_id no proporcionado" });
    }

    // Consulta para obtener las credenciales basadas en el company_id
    const selectQuery = "SELECT * FROM company_credentials WHERE company_id = ?";
    connection.query(selectQuery, [company_id], (selectErr, results) => {
        if (selectErr) {
            console.error("Error al obtener las credenciales:", selectErr);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Credenciales no encontradas para el company_id proporcionado" });
        }

        // Devolver las credenciales
        const credentialsList = results.map(cred => {
            delete cred.password; // Es importante no devolver la contraseña, incluso si está cifrada
            return cred;
        });
        res.json({ credentials: credentialsList });
    });
};
const createCompanyCredentials = (req, res) => {
    const {
        pinCertificado,
        usuario,
        password,
        client_id,
        client_secret,
        company_id
    } = req.body;

    // Verificar si el usuario ya existe en la base de datos
    const checkQuery = "SELECT * FROM company_credentials WHERE usuario = ?";
    const checkValues = [usuario];
    connection.query(checkQuery, checkValues, (checkErr, checkResults) => {
        if (checkErr) {
            console.error("Error al verificar la existencia de las credenciales:", checkErr);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        if (checkResults.length > 0) {
            // El usuario ya existe
            return res.status(400).json({ error: "El usuario ya está en uso" });
        }

        // Generar el hash de la contraseña
        bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
            if (hashErr) {
                console.error("Error al generar el hash de la contraseña:", hashErr);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            // Crear la consulta SQL para insertar las credenciales en la tabla
            const insertQuery = 'INSERT INTO company_credentials (pinCertificado, usuario, password, client_id, client_secret, company_id) VALUES (?, ?, ?, ?, ?, ?)';
            const insertValues = [
                pinCertificado,
                usuario,
                hashedPassword,
                client_id,
                client_secret,
                company_id
            ];

            // Ejecutar la consulta en la base de datos
            connection.query(insertQuery, insertValues, (insertErr, insertResults) => {
                if (insertErr) {
                    console.error("Error al guardar las credenciales:", insertErr);
                    return res.status(500).json({ error: "Error interno del servidor" });
                }

                // Devolver el ID de las credenciales creadas
                res.json({ message: "Credenciales creadas exitosamente", credentialsId: insertResults.insertId });
            });
        });
    });
};
const updateCompanyInfo = (req, res) => {
    const { id } = req.params; // Obteniendo el ID desde los parámetros de la ruta

    const {
        name,
        legal_name,
        trade_name,
        identification_type,
        identification_number,
        phone,
        fax,
        email,
        economic_activity,
        tax_regime,
        status
    } = req.body;

    // Verificar si el ID es válido
    if (!id) {
        return res.status(400).json({ error: "ID no proporcionado" });
    }

    // Crear la consulta SQL para actualizar los datos de la compañía
    const updateQuery = `
        UPDATE company 
        SET 
            name = ?, 
            legal_name = ?, 
            trade_name = ?, 
            identification_type = ?, 
            identification_number = ?, 
            phone = ?, 
            fax = ?, 
            email = ?, 
            economic_activity = ?, 
            tax_regime = ?, 
            status = ? 
        WHERE id = ?
    `;

    const updateValues = [
        name,
        legal_name,
        trade_name,
        identification_type,
        identification_number,
        phone,
        fax,
        email,
        economic_activity,
        tax_regime,
        status,
        id
    ];

    // Ejecutar la consulta en la base de datos
    connection.query(updateQuery, updateValues, (updateErr, updateResults) => {
        if (updateErr) {
            console.error("Error al actualizar la compañía:", updateErr);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        if (updateResults.affectedRows === 0) {
            return res.status(404).json({ error: "Compañía no encontrada" });
        }

        // Devolver un mensaje de éxito
        res.json({ message: "Compañía actualizada exitosamente" });
    });
};
const getCompanyData = (req, res) => {
    const companyId = req.params.companyId; // Asumiendo que el ID de la compañía viene como un parámetro en la URL

    connection.query(
        `
        SELECT 
            *
        FROM 
            company_address_view
        WHERE 
            status = 'ACTIVE'
            AND id = ?`,
        [companyId],
        (error, results) => {
            if (error) {
                console.error('Error al obtener los datos de la compañía:', error);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: "Company not found" });
            }

            // Retornar los resultados tal cual
            res.json(results[0]);
        }
    );
};

async function getInvoiceParameters(companyId) {
    try {
      const [rows] = await pool.query(
        'SELECT optional_message1, optional_message2, optional_message3, include_logo, logo_url FROM invoice_parameters WHERE company_id = ?',
        [companyId]
      );
      return rows[0]; // Asumiendo que siempre hay una entrada por compañía
    } catch (error) {
      console.error('Se produjo un error al obtener los parámetros de la factura:', error);
      throw error;
    }
  }
module.exports = { updateCompanyInfo, createCompanyCredentials,getCompanyCredentialsByCompanyId, getCompanyData,getInvoiceParameters  };