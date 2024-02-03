import React, { useState } from "react";
import CategoryCreateForm from "./CreateCategories";
import PopUp from "../../../../components/popUp";
import Button from "../../../../components/buttons/Button";
import CategoryLabel from "../../../../components/categories";

const Categories = ( {categories}) => {
  const [isPopUpOpen, setPopUpOpen] = useState(false);

  const togglePopUp = () => {
    setPopUpOpen((prev) => !prev);
  };
  return (
    <div className="p-10 rounded-main bg-white border shadow  w-full">
      <div className=" flex items-center  w-full justify-between">
        <h2 className="text-2xl text-main-blue">Categorias</h2>
        <Button type="ADD" onClick={togglePopUp} />
      </div>
      <div className="flex gap-4 w-full  p-5 r  px-5 overflow-x-scroll">
        {categories.map((category) => (
          <CategoryLabel key={category.id} name={category.name}></CategoryLabel>
        ))}
      </div>
      <div className="w-80">
        <PopUp isOpen={isPopUpOpen} onClose={togglePopUp}>
          <CategoryCreateForm onClose={togglePopUp}></CategoryCreateForm>
        </PopUp>
      </div>
    </div>
  );
};

export default Categories;
