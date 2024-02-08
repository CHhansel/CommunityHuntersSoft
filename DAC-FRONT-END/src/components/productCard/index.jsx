import React from "react";

const ProductCard = ({ product }) => {
  console.log("cadc",product);
  return (
    <div className="flex flex-row rounded-main bg-white border shadow w-[450px] cursor-zoom-in">
      <div className="w-3/6 ">
        {" "}
        <img className="w-full" src={product.image_url} alt="imagen de producto" />
      </div>
      <div className="w-3/6 flex flex-col justify-between p-4">
        <h4>{product.name}</h4>
        <div className=" flex justify-end w-100">
          <p>₡{product.price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
