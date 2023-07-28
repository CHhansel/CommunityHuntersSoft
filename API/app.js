const express = require('express');
const connection = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');



const app = express();
const port = 3000;
app.use(express.json());


//rutas
app.use("/api/user", require("./routes/user"));
app.use("/api/property", require("./routes/property"));
app.use("/api/customer", require("./routes/customer"));
app.use("/api/address", require("./routes/address_info"));

// Resto de tus rutas y lógica de la API

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
