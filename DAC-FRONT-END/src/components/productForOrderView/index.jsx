import React from "react";
import FormattedCurrency from "../NumberFormat";

const ProductForOrderView = ({ product }) => {
  const cardStyle = {
    backgroundImage: `url(${product.image_url})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const textStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro con opacidad para los textos
    color: "white", // Color de texto blanco para mejor contraste
  };

  return (
    <div
      className="rounded-main bg-black hover:filter hover:brightness-75 overflow-hidden shadow w-[200px] h-[200px] "
      style={cardStyle}
    >
      <div className="flex flex-col justify-between h-full filter grayscale">
        <div className="px-3 py-1" style={textStyle}>
          <h4>
            {product.internal_code} - {product.name}
          </h4>
        </div>
        <div className="flex justify-end w-full px-3 py-1" style={textStyle}>
          {product.comparison_price > 0 ? (
            <p className="mr-2 flex">
              <span className="line-through mx-3">
                <FormattedCurrency amount={product.comparison_price} />
              </span>{" "}
              / <FormattedCurrency amount={product.price} />
            </p>
          ) : (
            <FormattedCurrency amount={product.price} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductForOrderView;
