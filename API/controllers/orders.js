const pool = require("../config/db2");

const insertOrderWithProducts = async (req, res) => {
  const {
    company_id,
    table,
    employee,
    type,
    subtotal,
    total,
    orderCustomerInfo,
    beeper_number,
    order_number,
    products, // Asumimos que este es un arreglo de objetos {idProducto, state, comentarios}
  } = req.body;
  try {
    // Iniciar una transacción
    await pool.query("START TRANSACTION");

    // Insertar la orden
    const insertOrderQuery = `
            INSERT INTO restaurant_order (company_id, mesa, employee, type, subtotal, total, customer_address, customer_name, customer_phone, beeper_number, order_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [orderResult] = await pool.query(insertOrderQuery, [
      company_id,
      table,
      employee,
      type,
      subtotal,
      total,
      orderCustomerInfo.address,
      orderCustomerInfo.name,
      orderCustomerInfo.phone,
      beeper_number,
      order_number,
    ]);

    const orderId = orderResult.insertId;

    // Insertar cada producto asociado con la orden
    const insertProductPerOrderQuery = `
            INSERT INTO product_per_order
            (idOrden, idProducto, comentarios)
            VALUES
            (?, ?, ?)
        `;

    for (const product of products) {
      await pool.query(insertProductPerOrderQuery, [
        orderId,
        product.id,
        product.comment,
      ]);
    }

    // Confirmar la transacción si todo se ejecutó correctamente
    await pool.query("COMMIT");

    // Enviar una respuesta de éxito
    res.json({
      message: "Orden y productos asociados creados exitosamente",
      orderId,
    });
  } catch (err) {
    // Hacer rollback en caso de error
    await pool.query("ROLLBACK");

    console.error("Error al insertar la orden y los productos asociados:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const updateOrder = async (req, res) => {
  const {
    id,
    type,
    subtotal,
    total,
    customer_address,
    customer_name,
    customer_phone,
    beeper_number,
    order_number,
    state
  } = req.body;
 console.log(req.body);
  try {
    // Iniciar una transacción
    await pool.query("START TRANSACTION");

    // Actualizar la orden en la tabla restaurant_order
    const updateOrderQuery = `
      UPDATE restaurant_order
      SET
        type = ?,
        subtotal = ?,
        total = ?,
        customer_address = ?,
        customer_name = ?,
        customer_phone = ?,
        beeper_number = ?,
        order_number = ?,
        state = ?
      WHERE id = ?
    `;
    await pool.query(updateOrderQuery, [
      type,
      subtotal,
      total,
      customer_address,
      customer_name,
      customer_phone,
      beeper_number,
      order_number,
      state,
      id,
    ]);

    // Confirmar la transacción si todo se ejecutó correctamente
    await pool.query("COMMIT");

    // Enviar una respuesta de éxito
    res.json({
      message: "Orden actualizada exitosamente",
      id,
    });
  } catch (err) {
    // Hacer rollback en caso de error
    await pool.query("ROLLBACK");

    console.error("Error al actualizar la orden:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const updateProductsInOrder = async (req, res) => {
  const { orderId } = req.params; // Obtener el orderId de los parámetros de la solicitud
  const { products } = req.body; // Obtener todos los productos de la solicitud
  console.log(req.body);
  try {
    // Iniciar una transacción
    await pool.query("START TRANSACTION");

    // Eliminar todos los productos asociados a la orden
    await pool.query("DELETE FROM product_per_order WHERE idOrden = ?", [orderId]);

    // Insertar los nuevos productos
    const insertProductQuery = `
      INSERT INTO product_per_order (idOrden, idProducto, state, comentarios)
      VALUES (?, ?, ?, ?)`;
    for (const product of products) {
      await pool.query(insertProductQuery, [
        orderId,
        product.id,
        null,
        product.comment,
      ]);
    }

    // Confirmar la transacción si todo se ejecutó correctamente
    await pool.query("COMMIT");

    // Enviar una respuesta de éxito
    res.json({
      message: "Productos asociados a la orden actualizados exitosamente",
      orderId,
    });
  } catch (err) {
    // Hacer rollback en caso de error
    await pool.query("ROLLBACK");

    console.error("Error al actualizar los productos asociados a la orden:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


const getOrdersPaginated = async (req, res) => {
  const { company_id, page, itemsPerPage } = req.query;

  // Valida que los parámetros necesarios estén presentes
  if (!company_id || !page || !itemsPerPage) {
    return res.status(400).json({ error: "Faltan parámetros requeridos" });
  }

  const query = "CALL sp_get_orders_paginated(?, ?, ?)";
  const values = [company_id, page, itemsPerPage];

  try {
    const [result] = await pool.query(query, values);

    // El procedimiento almacenado debería devolver dos conjuntos de resultados: las órdenes y el total
    const orders = result[0];
    const totalOrders = result[1][0].total_rows;

    if (orders.length === 0) {
      return res.status(404).json({
        error: "No se encontraron órdenes para la compañía dada",
        totalOrders: 0,
      });
    }

    res.json({ orders, totalOrders });
  } catch (err) {
    console.error("Error al obtener las órdenes:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getProductsByOrderId = async (req, res) => {
  const { orderId } = req.params; // Obtener el ID de la orden de los parámetros de la solicitud

  // Verificar si el ID de la orden está presente en la solicitud
  if (!orderId) {
    return res.status(400).json({ error: "Se requiere el ID de la orden" });
  }

  const query = "SELECT * FROM product_order_view WHERE idOrden = ?";
  const values = [orderId];

  try {
    const [result] = await pool.query(query, values);

    // Verificar si se encontraron productos para la orden
    if (result.length === 0) {
      return res.status(404).json({
        error: "No se encontraron productos para la orden especificada",
      });
    }

    // Enviar los productos encontrados como respuesta
    res.json({ products: result });
  } catch (err) {
    console.error("Error al obtener los productos de la orden:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const getUnpaidOrdersWithProducts = async (req, res) => {
  const { company_id } = req.query;

  // Valida que el parámetro necesario esté presente
  if (!company_id) {
    return res
      .status(400)
      .json({ error: "Falta el parámetro requerido 'company_id'" });
  }

  const unpaidOrdersQuery =
    "SELECT * FROM restaurant_order WHERE company_id = ? AND state != 3";

  try {
    const [orders] = await pool.query(unpaidOrdersQuery, [company_id]);

    if (orders.length === 0) {
      return res.status(404).json({
        error: "No se encontraron órdenes no pagadas para la compañía dada",
        totalOrders: 0,
      });
    }

    // Obtener los productos asociados a cada orden no pagada
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const productsQuery = "SELECT * FROM product_order_view WHERE idOrden = ?";
        const [products] = await pool.query(productsQuery, [order.id]);
        return { ...order, products };
      })
    );

    res.json({ orders: ordersWithProducts, totalOrders: orders.length });
  } catch (err) {
    console.error("Error al obtener las órdenes no pagadas:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const getOrderWithProducts = async (req, res) => {
  const { orderId } = req.params;
  // Valida que el parámetro necesario esté presente
  if (!orderId) {
    return res
      .status(400)
      .json({ error: "Falta el parámetro requerido 'orderId'" });
  }

  const getOrderQuery =
    "SELECT * FROM restaurant_order WHERE id = ?";

  try {
    // Obtener la orden con el ID proporcionado
    const [orderResult] = await pool.query(getOrderQuery, [orderId]);

    // Verificar si la orden fue encontrada
    if (orderResult.length === 0) {
      return res.status(404).json({
        error: "No se encontró la orden con el ID proporcionado",
      });
    }

    const order = orderResult[0];

    // Obtener los productos asociados a la orden
    const productsQuery = "SELECT * FROM view_product_details_per_order WHERE idOrden = ?";
    const [productsResult] = await pool.query(productsQuery, [orderId]);
    const products = productsResult.map(product => ({
      id: product.idProducto,
      state: product.state,
      comentarios: product.comentarios
    }));

    // Combinar la información de la orden y los productos
    const orderWithProducts = {
      ...order,
      productsResult
    };

    res.json({ order: orderWithProducts });
  } catch (err) {
    console.error("Error al obtener la orden con productos:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


module.exports = {
  insertOrderWithProducts,
  getOrdersPaginated,
  getProductsByOrderId,
  getUnpaidOrdersWithProducts,
  getOrderWithProducts,
  updateProductsInOrder,
  updateOrder
};
