import { useEffect, useState } from "react";
import delete_icon from "../../assets/delete-icon.svg";
import FormattedCurrency from "../NumberFormat";
import note from "../../assets/note.svg";
import expand from "../../assets/expand-collapse.svg";

const OrderProductItem = ({ product, removeProductFromOrder, addComment }) => {
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [comment, setComment] = useState();
  const [isTakeaway, setIsTakeaway] = useState(false); // Nuevo estado para "Para Llevar"
  const toggleDescription = () => {
    setIsDescriptionVisible(!isDescriptionVisible);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
    addComment(product.uniqueId, event.target.value);
  };

  // Función para manejar cambios en el checkbox de "Para Llevar"
  const handleTakeawayChange = (event) => {
    setIsTakeaway(event.target.checked); // Actualizar el estado basado en si el checkbox está marcado o no
  };
 useEffect(() => {
  setComment(product.comment)
 }, [])
 
  return (
    <li className="border rounded-main px-3 mb-1 relative">
      <div className="flex justify-between items-center">
        <p className="w-6/12">
          {product.internal_code} - {product.name}
        </p>
        <div className="w-2/12">
          <FormattedCurrency amount={product.price} />
        </div>
        <div className="flex justify-center w-1/12">
          <input
            type="checkbox"
            id="takeaway"
            checked={isTakeaway}
            onChange={handleTakeawayChange}
          />
        </div>
        <div className="w-1/12 flex justify-center items-center">
          <button onClick={() => removeProductFromOrder(product.uniqueId)}>
            <img src={delete_icon} alt="Delete" />
          </button>
        </div>

        <div className="w-1/12 flex justify-center">
          <button onClick={toggleDescription} className=" ml-2 py-3">
            <img
              src={expand}
              alt={isDescriptionVisible ? "Collapse" : "Expand"}
              className={`h-6 transition-transform duration-500 ${
                isDescriptionVisible ? "rotate-180" : "rotate-0 transform"
              }`}
            />
          </button>
          {comment && comment.length > 0 ? (
            <img className="w-6" src={note}></img>
          ) : (
            <div className="w-6"></div>
          )}
        </div>
      </div>
      {isDescriptionVisible && (
        <div className="w-full px-5 pb-5">
          <label htmlFor="note">Nota</label>
          <textarea
            className="input-text w-full h-24 mt-2"
            id="note"
            value={comment}
            onChange={handleCommentChange}
          ></textarea>
        </div>
      )}
    </li>
  );
};

export default OrderProductItem;
