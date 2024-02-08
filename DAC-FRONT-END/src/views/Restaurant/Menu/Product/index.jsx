import React, { useState } from "react";
import PopUp from "../../../../components/popUp";
import ProductCreate from "./CreateProduct";
import Button from "../../../../components/buttons/Button";
import ProductCard from "../../../../components/productCard";

const Products = ({ products }) => {
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const togglePopUp = () => {
    setPopUpOpen((prev) => !prev);
  };

  const createProduct = () => {
    setSelectedProduct(null);
    togglePopUp();
  };
  const updateProduct = (selectedProduct) => {
    setSelectedProduct(selectedProduct); // Guarda el producto seleccionado en selectedProduct
    togglePopUp();
  };
  return (
    <div className="p-10 rounded-main bg-white border shadow  w-full">
      <div className=" flex items-center  w-full justify-between">
        <h2 className="text-2xl text-main-blue">Productos</h2>
        <Button type="ADD" onClick={createProduct} />
      </div>
      <PopUp isOpen={isPopUpOpen} onClose={togglePopUp}>
        <ProductCreate
          onClose={togglePopUp}
          selectedProduct={selectedProduct}
        ></ProductCreate>
      </PopUp>
      <div className="flex flex-wrap gap-5 justify-start mt-7">
        {products.map((item) => (
          <div key={item.id} onClick={() => updateProduct(item)}>
            <ProductCard key={item.id} product={item}></ProductCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
