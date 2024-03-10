const areOrdersDifferent = (newOrders, currentOrders) => {
  if (newOrders.length !== currentOrders.length) return true;

  for (let i = 0; i < newOrders.length; i++) {
    const newOrder = newOrders[i];
    const currentOrder = currentOrders.find((o) => o.id === newOrder.id);

    // Si no se encuentra una orden correspondiente o si las ordenes son diferentes, se considera que hay cambios.
    if (!currentOrder || !isOrderEqual(newOrder, currentOrder)) {
      return true;
    }
  }
  return false;
};

const isOrderEqual = (newOrder, currentOrder) => {
  // Comprueba si los campos relevantes, excepto 'fecha_creacion', son iguales
  return (
    newOrder.id === currentOrder.id &&
    newOrder.company_id === currentOrder.company_id &&
    newOrder.mesa === currentOrder.mesa &&
    newOrder.state === currentOrder.state &&
    newOrder.employee === currentOrder.employee &&
    newOrder.type === currentOrder.type &&
    newOrder.total === currentOrder.total &&
    areProductsEqual(newOrder.products, currentOrder.products)
  );
};

const areProductsEqual = (newProducts, currentProducts) => {
  if (newProducts.length !== currentProducts.length) return false;

  for (let i = 0; i < newProducts.length; i++) {
    const newProduct = newProducts[i];
    const currentProduct = currentProducts.find(
      (p) => p.product_per_order_id === newProduct.product_per_order_id
    );

    if (!currentProduct || !isProductEqual(newProduct, currentProduct)) {
      return false;
    }
  }
  return true;
};
const isProductEqual = (newProduct, currentProduct) => {
  // Comprueba si todos los campos relevantes de los productos son iguales
  return (
    newProduct.product_per_order_id === currentProduct.product_per_order_id &&
    newProduct.idOrden === currentProduct.idOrden &&
    newProduct.idProducto === currentProduct.idProducto &&
    newProduct.state === currentProduct.state &&
    newProduct.llevar === currentProduct.llevar &&
    newProduct.comentarios === currentProduct.comentarios &&
    newProduct.name === currentProduct.name &&
    newProduct.description === currentProduct.description &&
    newProduct.price === currentProduct.price &&
    newProduct.company_id === currentProduct.company_id
  );
};
