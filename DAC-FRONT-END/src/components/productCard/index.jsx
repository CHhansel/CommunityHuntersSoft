import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="flex flex-col rounded-main bg-white border overflow-hidden shadow w-[250px] cursor-zoom-in">
      <div className="w-full h-[200px] overflow-hidden">
        <img
          className="w-full h-full"
          src={product.image_url}
          alt="imagen de producto"
        />
      </div>
      <div className="w-full flex flex-col justify-between p-4 h-48">
        <h4 className="h-12 leading-5 mb-3 text-sm text-ellipsis">
          {product.internal_code} - {product.name}
        </h4>
        <div className="parrafo-ellipsis  h-12 text-ellipsis">
          <p className=" text-xs mt-1 ">{product.description}</p>
        </div>
        <div className="flex justify-end w-100 mt-4">
          {product.comparison_price > 0 ? (
            <p className="mr-2">
              <span className="line-through">₡{product.comparison_price}</span>{" "}
              / ₡{product.price}
            </p>
          ) : (
            <p>₡{product.price}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
