import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import { ComponentToPrint } from "../OrderTicket";

const OrderView = ({ order }) => {
  const getTypeDetails = (type) => {
    switch (type) {
      case 1:
        return { text: "Para llevar", colorClass: "bg-red-500" };
      case 2:
        return { text: "Express", colorClass: "bg-green-500" };
      case 3:
        return { text: "Comer Aca", colorClass: "bg-blue-500" };
      default:
        return { text: "Tipo desconocido", colorClass: "bg-gray-500" };
    }
  };

  // Extrae tanto el texto como la clase de color para el tipo de orden actual
  const { text: typeText, colorClass } = getTypeDetails(order.type);
  const getTimePassedInMinutes = (timestamp) => {
    // Crear un objeto Date con el timestamp
    const date = new Date(timestamp);

    // Obtener la diferencia en milisegundos entre la fecha actual y el timestamp
    const diffInMilliseconds = new Date() - date;

    // Convertir la diferencia a minutos
    const diffInMinutes = Math.floor(diffInMilliseconds / 60000);

    return diffInMinutes;
  };
  const minutesPassed = getTimePassedInMinutes(order.fecha_creacion);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div
      className="border mb-5 min-w-[400px] cursor-pointer"
      onClick={handlePrint}
    >
       
      <div className="hidden">
        <ComponentToPrint ref={componentRef} order={order} />
      </div>
      <div className={`flex justify-between gap-3 ${colorClass} px-3 `}>
        <h2 className="text-white">#: {order.order_number}</h2>
        <p className="text-white">Mesa: {order.mesa}</p>
        <p className="text-white">{typeText}</p>

        <p className="flex flex-row text-white">{minutesPassed} m</p>
      </div>
      <ul>
        {order.products.map((product, index) => (
          <li
            key={product.id}
            className={`${index % 2 === 0 ? "bg-black" : ""} px-3 py-1`}
          >
            <p className="font-bold text-white">
              {++index}. {product.name}
            </p>
            <p className="ml-5 text-white">{product.comentarios}</p>
            <div className="w-full h-[1px] bg-slate-600 "></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderView;
