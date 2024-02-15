import React, { useState } from "react";
import PopUp from "../../../../components/popUp";
import ProductCreate from "./CreateProduct";
import Button from "../../../../components/buttons/Button";
import ProductCard from "../../../../components/productCard";

const Products = ({ products, category, handleReloadCategories }) => {
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
        {category && (
          <>
            <h2 className="text-2xl text-main-blue">{category.name}</h2>
            <Button
              type="ADD"
              onClick={createProduct}
              text={"PRODUCTO A ESTA CATEGORIA"}
            />
          </>
        )}
        {category == null && (
          <h2 className="text-2xl text-main-blue">Todos los productos</h2>
        )}
      </div>
      <PopUp isOpen={isPopUpOpen} onClose={togglePopUp}>
        <ProductCreate
          onClose={togglePopUp}
          selectedProduct={
            selectedProduct
            }
          category = {category}
          handleReloadCategories={handleReloadCategories}
        ></ProductCreate>
      </PopUp>
      <div className="flex flex-wrap gap-5 justify-evenly mt-7">
        {products.map((item) => (
          <div className="mb-5" key={item.id} onClick={() => updateProduct(item)}>
            <ProductCard key={item.id} product={item}></ProductCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
