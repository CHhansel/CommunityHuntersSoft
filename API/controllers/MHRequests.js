const connection = require('../config/db');

const getToken = async (req, res) => {
    const { company_id } = req.params;

    if (!company_id) {
        return res.status(400).json({ error: 'company_id no proporcionado' });
    }

    const selectQuery = 'SELECT * FROM company_credentials WHERE company_id = ?';
    connection.query(selectQuery, [company_id], async (err, results) => {
        if (err) {
            console.error('Error al obtener las credenciales:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Credenciales no encontradas para el company_id proporcionado' });
        }

        const credentials = results[0];

        try {
            const response = await axios.post(
                'https://idp.comprobanteselectronicos.go.cr/auth/realms/rut-stag/protocol/openid-connect/token',
                null,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                    },
                    params: {
                        client_id: credentials.client_id,
                        username: credentials.usuario,
                        password: credentials.password,
                        grant_type: 'password'
                    }
                }
            );

            const token = response.data.access_token;
            res.json({ token });
        } catch (error) {
            console.error('Error al solicitar el token:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
};

module.exports = { getToken };



