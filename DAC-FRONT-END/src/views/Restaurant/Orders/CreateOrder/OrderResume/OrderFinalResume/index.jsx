import React from "react";
import Button from "../../../../../../components/buttons/Button";

const OrderFinalResume = ({
  close,
  order,
  products,
  handleSubmitOrder,
  tables,
}) => {
  const getProductNameById = (productId) => {
    const product = products.find((product) => product.id === productId);
    return product ? product.name : "Producto no encontrado";
  };
  const handleConfirmation = () => {
    handleSubmitOrder();
  };
  return (
    <div className="p-10 rounded-main bg-white border shadow">
      <h2>Detalles del Pedido</h2>
      <ul className="border">
        {order.products.map((product, index) => (
          <li key={product.uniqueId} className=" my-2 py-2 px-5">
            <div>
              {" "}
              {++index}. {getProductNameById(product.id)}
            </div>
            {product.comment.length > 0 && (
              <div className="ml-5">
                {" "}
                <span>Nota:</span> {product.comment || ""}
              </div>
            )}{" "}
          </li>
        ))}
      </ul>
      <div>
        <h3>Resumen del Pedido</h3>
        <p>Subtotal: ${order.subtotalPrice}</p>

        {order.selectedOrderType === "1" && (
          <div>
            <h4>Información del Cliente</h4>
            <p>Nombre: {order.orderCustomerInfo.name}</p>
            <p>Teléfono: {order.orderCustomerInfo.phone}</p>
            <p>Dirección: {order.orderCustomerInfo.address}</p>
          </div>
        )}
        {order.selectedOrderType === "3" && order.selectedTable != null && (
          <div>
            <h4>
              Mesa: {tables.find((t) => t.id == order.selectedTable).number}
            </h4>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <Button type="UNDO" onClick={close} text="" />

        <Button type="CONFIRM" onClick={handleConfirmation} text={"ORDEN"} />
      </div>
    </div>
  );
};

export default OrderFinalResume;
