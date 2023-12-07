const connection = require("../config/db"); // Ajusta la ruta según la ubicación de tu archivo de conexión


const getAllPaymentMethods = (req, res) => {
    // Consulta SQL para obtener todos los elementos de la tabla tiposdeidentificacion
    const selectQuery = `
        SELECT * FROM medio_pago
    `;
  
    // Ejecutar la consulta en la base de datos
    connection.query(selectQuery, (err, results) => {
        if (err) {
            console.error('Error al obtener los medios de pago:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
  
        res.json({ dniTypes: results });
    });
  };

  const getAllSaleCondition = (req, res) => {
    // Consulta SQL para obtener todos los elementos de la tabla tiposdeidentificacion
    const selectQuery = `
        SELECT * FROM condicionesdeventa
    `;
  
    // Ejecutar la consulta en la base de datos
    connection.query(selectQuery, (err, results) => {
        if (err) {
            console.error('Error al obtener las condiciones de venta:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
  
        res.json({ dniTypes: results });
    });
  };
const getAllDniTypes = (req, res) => {
  // Consulta SQL para obtener todos los elementos de la tabla tiposdeidentificacion
  const selectQuery = `
      SELECT * FROM tiposdeidentificacion
  `;

  // Ejecutar la consulta en la base de datos
  connection.query(selectQuery, (err, results) => {
      if (err) {
          console.error('Error al obtener los tipos de DNI:', err);
          return res.status(500).json({ error: 'Error interno del servidor' });
      }

      res.json({ dniTypes: results });
  });
};

module.exports = {
  getAllDniTypes,
  getAllPaymentMethods,
  getAllSaleCondition
};
