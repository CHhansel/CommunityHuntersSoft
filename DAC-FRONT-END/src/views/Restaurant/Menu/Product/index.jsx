import React, { useState } from "react";
import PopUp from "../../../../components/popUp";
import ProductCreate from "./CreateProduct";
import Button from "../../../../components/buttons/Button";

const Products = () => {
  const [isPopUpOpen, setPopUpOpen] = useState(false);

  const togglePopUp = () => {
    setPopUpOpen((prev) => !prev);
  };
  return (
    <div className="p-10 rounded-main bg-white border shadow  w-full">
      <div className=" flex items-center  w-full justify-between">
        <h2 className="text-2xl text-main-blue">Productos</h2>
        <Button type="ADD" onClick={togglePopUp} />
      </div>
      <PopUp isOpen={isPopUpOpen} onClose={togglePopUp}>
        <ProductCreate onClose={togglePopUp}></ProductCreate>
      </PopUp>
    </div>
  );
};

export default Products;
