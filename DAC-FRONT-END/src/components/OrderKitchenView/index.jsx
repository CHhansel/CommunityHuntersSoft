import React from "react";

const OrderView = ({ order }) => {
  const getTypeText = (type) => {
    switch (type) {
      case "1":
        return "Para llevar";
      case "2":
        return "Express";
      case "3":
        return "Comer Aca";
      default:
        return "Tipo desconocido";
    }
  };
  return (
    <div key={order.id} className="border rounded-main mb-5 w-full">
      <div className="flex justify-between gap-3 bg-slate-400 px-3 ">
        <h2>#: {order.order_number}</h2>
        <p>Mesa: {order.mesa}</p>
        <p>{getTypeText(order.type)}</p>
      </div>
      <ul>
        {order.products.map((product,index) => (
          <li key={product.id} className={`${
            index % 2 === 0 ? "bg-slate-200" : ""
          } p-3 `}>
            <p className="font-bold">{++index}. {product.name}</p>
            <p className="ml-5">{product.comentarios}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderView;
