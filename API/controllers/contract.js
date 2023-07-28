


const connection = require('../database/connection');

// Controlador para crear un nuevo contrato
const createContract = (req, res) => {
  const {
    customer_id,
    properties_id,
    user_info_id,
    start_date,
    end_date,
    rent_amount,
    tax_amount,
    payment_method,
    deposit_amount,
    payment_date,
    active,
    terms_and_conditions,
    contract_file
  } = req.body;

  // Realiza las validaciones necesarias en el cuerpo de la solicitud
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(422).json({ errors: errors.array() });
//   }

  // Crear la consulta SQL para insertar un nuevo contrato en la tabla `contracts`
  const query = `
    INSERT INTO contracts (
      customer_id,
      properties_id,
      user_info_id,
      start_date,
      end_date,
      rent_amount,
      tax_amount,
      payment_method,
      deposit_amount,
      payment_date,
      active,
      terms_and_conditions,
      contract_file
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    customer_id,
    properties_id,
    user_info_id,
    start_date,
    end_date,
    rent_amount,
    tax_amount,
    payment_method,
    deposit_amount,
    payment_date,
    active,
    terms_and_conditions,
    contract_file
  ];

  // Ejecutar la consulta en la base de datos
  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al crear el contrato:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    // El contrato se creó correctamente
    res.json({ message: 'Contrato creado exitosamente', contractId: result.insertId });
  });
};
// Controlador para actualizar un contrato existente
const updateContract = (req, res) => {
    const contractId = req.params.id; // Obtiene el ID del contrato a actualizar desde los parámetros de la URL
    const {
      customer_id,
      properties_id,
      user_info_id,
      start_date,
      end_date,
      rent_amount,
      tax_amount,
      payment_method,
      deposit_amount,
      payment_date,
      active,
      terms_and_conditions,
      contract_file
    } = req.body;
  
    // Realiza las validaciones necesarias en el cuerpo de la solicitud
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    // Crear la consulta SQL para actualizar el contrato en la tabla `contracts`
    const query = `
      UPDATE contracts
      SET
        start_date = ?,
        end_date = ?,
        rent_amount = ?,
        tax_amount = ?,
        payment_method = ?,
        deposit_amount = ?,
        payment_date = ?,
        terms_and_conditions = ?,
        contract_file = ?
      WHERE
        id = ?
    `;
    const values = [
      start_date,
      end_date,
      rent_amount,
      tax_amount,
      payment_method,
      deposit_amount,
      payment_date,
      terms_and_conditions,
      contract_file,
      contractId
    ];
  
    // Ejecutar la consulta en la base de datos
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error al actualizar el contrato:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Contrato no encontrado' });
      }
  
      // El contrato se actualizó correctamente
      res.json({ message: 'Contrato actualizado exitosamente' });
    });
  };
module.exports = {
  createContract, updateContract
};
