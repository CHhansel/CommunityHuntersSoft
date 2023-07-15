const express = require('express');
const connection = require('./config/db');

const { createUser, loginUserController } = require('./controllers/auth');

const app = express();
const port = 3000;
app.use(express.json());

// Ruta de ejemplo que realiza una consulta a la base de datos
app.get('/api/users', (req, res) => {
  const query = 'SELECT * FROM user';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    res.json(results);
  });
});

// Ruta para crear un nuevo usuario
app.post('/api/create-user', createUser);

// Ruta para iniciar sesión
app.post('/api/login', loginUserController.login);

// Resto de tus rutas y lógica de la API

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
