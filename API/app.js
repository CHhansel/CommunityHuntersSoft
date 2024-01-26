const express = require('express');
const connection = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');



const app = express();
const port = 3000;
app.use(express.json());

const cors = require('cors');

// Configura CORS para permitir solicitudes desde tu dominio frontend
const corsOptions = {
  origin: 'http://localhost:5173', // Reemplaza con la URL de tu frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

//rutas
app.use("/api/user", require("./routes/user"));
app.use("/api/property", require("./routes/property"));
app.use("/api/customer", require("./routes/customer"));
app.use("/api/contract", require("./routes/contract"));
app.use("/api/address", require("./routes/address_info"));
app.use("/api/role", require("./routes/role"));
app.use("/api/employee", require("./routes/employee"));
app.use("/api/module", require("./routes/module"));
app.use("/api/cabys", require("./routes/cabys"));
app.use("/api/company", require("./routes/company"));
app.use("/api/atv", require("./routes/MHRequest"));
app.use("/api/billing", require("./routes/billing"));
// Resto de tus rutas y lógica de la API

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
