


const connection = require('../database/connection');

const createContract = (req, res) => {
  const { customer_id, properties_id, user_info_id, start_date, end_date, rent_amount, tax_amount, payment_method, deposit_amount, payment_date, active, terms_and_conditions, contract_file } = req.body;

  // Verificar si el cliente existe
  const checkCustomerQuery = 'SELECT id FROM customer WHERE id = ?';
  connection.query(checkCustomerQuery, [customer_id], (err, customerResult) => {
    if (err) {
      console.error('Error al verificar la existencia del cliente:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (customerResult.length === 0) {
      return res.status(404).json({ error: 'El cliente especificado no existe' });
    }

    // Verificar si la propiedad existe
    const checkPropertyQuery = 'SELECT id FROM property WHERE id = ?';
    connection.query(checkPropertyQuery, [properties_id], (err, propertyResult) => {
      if (err) {
        console.error('Error al verificar la existencia de la propiedad:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      if (propertyResult.length === 0) {
        return res.status(404).json({ error: 'La propiedad especificada no existe' });
      }

      // Llama al procedimiento almacenado para crear el contrato
      const createContractQuery = 'CALL sp_create_contract(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [customer_id, properties_id, user_info_id, start_date, end_date, rent_amount, tax_amount, payment_method, deposit_amount, payment_date, active, terms_and_conditions, contract_file];

      connection.query(createContractQuery, values, (err, result) => {
        if (err) {
          console.error('Error al crear el contrato:', err);
          return res.status(500).json({ error: 'Error interno del servidor' });
        }

        // El procedimiento devuelve un conjunto de resultados, accedemos a la primera posición para obtener el ID del nuevo contrato
        const contractId = result[0][0].id;

        res.json({ message: 'Contrato creado exitosamente', contractId });
      });
    });
  });
};

// Controlador para actualizar un contrato existente
const updateContract = (req, res) => {
    const contractId = req.params.id; // Obtiene el ID del contrato a actualizar desde los parámetros de la URL
    const {
      start_date,
      end_date,
      rent_amount,
      tax_amount,
      payment_method,
      deposit_amount,
      payment_date,
      terms_and_conditions,
      contract_file
    } = req.body;
  
    // Realiza las validaciones necesarias en el cuerpo de la solicitud
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(422).json({ errors: errors.array() });
    // }
  
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
  const updateContractState = (req, res) => {
    const { id } = req.params; // Obtiene el ID del contrato a actualizar desde los parámetros de la URL
    const { active } = req.body; // Obtiene el nuevo estado desde el cuerpo de la solicitud
  
    // Crear la consulta SQL para actualizar únicamente el campo "active" del contrato en la base de datos
    const updateQuery = 'UPDATE contracts SET active = ? WHERE id = ?';
    const updateValues = [active, id];
  
    // Ejecutar la consulta en la base de datos
    connection.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error('Error al actualizar el estado del contrato:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Contrato no encontrado' });
      }
  
      res.json({ message: 'Estado del contrato actualizado exitosamente' });
    });
  };
  const deleteContract = (req, res) => {
    const { id } = req.params; // Obtiene el ID del contrato a borrar desde los parámetros de la URL
  
    // Llama al procedimiento almacenado para borrar el contrato
    const deleteQuery = 'CALL sp_delete_contract(?)';
    const deleteValues = [id];
  
    connection.query(deleteQuery, deleteValues, (err, result) => {
      if (err) {
        console.error('Error al borrar el contrato:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Contrato no encontrado' });
      }
  
      res.json({ message: 'Contrato borrado exitosamente' });
    });
  };

module.exports = {
  createContract, updateContract, updateContractState, deleteContract
};
