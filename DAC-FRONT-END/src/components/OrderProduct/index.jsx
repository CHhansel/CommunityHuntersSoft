import React, { useState } from "react";
import delete_icon from "../../assets/delete-icon.svg";
import FormattedCurrency from "../NumberFormat";

const OrderProductItem = ({ product, removeProductFromOrder }) => {
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false); // Estado para controlar la visibilidad de la descripción

  // Función para alternar la visibilidad de la descripción
  const toggleDescription = () => {
    setIsDescriptionVisible(!isDescriptionVisible);
  };

  return (
    <li className="border rounded-main p-3 mb-1 relative">
      <div className="flex justify-between items-center">
        <p className="w-3/6">{product.name}</p>
        <div className="w-1/6">
          <FormattedCurrency amount={product.quantity * product.price} />
        </div>
        <div className="w-1/6 flex justify-center items-center">
          <button onClick={() => removeProductFromOrder(product.uniqueId)}>
            <img src={delete_icon} alt="Delete" />
          </button>
        </div>
        <div className="w-1/6 flex justify-center">
          <button onClick={toggleDescription} className="ml-2">
            {isDescriptionVisible ? "▲" : "▼"}
          </button>
        </div>
      </div>
      {isDescriptionVisible && (
        <div className=" pt-2 mt-2">
          <label htmlFor="note">Anotaciones</label>
          <textarea
            className="input-text w-full h-24 mt-2"
            name=""
            id="note"
          ></textarea>
        </div>
      )}
    </li>
  );
};

export default OrderProductItem;
