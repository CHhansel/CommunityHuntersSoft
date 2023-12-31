// swagger-config.js

const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/user.js', './routes/property.js','./routes/customer.js', './routes/contract.js', './routes/membership.js']; // Ruta hacia tus archivos de rutas

const doc = {
  info: {
    title: 'API Documentation',
    description: 'API Documentation',
    version: '1.0.0',
  },
  host: 'localhost:3000', // Cambiar por tu host y puerto
  basePath: '/api',
};

swaggerAutogen(outputFile, endpointsFiles, doc);


