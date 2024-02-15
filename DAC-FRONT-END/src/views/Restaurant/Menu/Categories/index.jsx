import React, { useState } from "react";
import CategoryCreateForm from "./CreateCategories";
import PopUp from "../../../../components/popUp";
import Button from "../../../../components/buttons/Button";
import CategoryLabel from "../../../../components/categories";

const Categories = ({ categories, selectedCategory, setSelectedCategory, handleReloadCategories }) => {
  const [isPopUpOpen, setPopUpOpen] = useState(false);

  const togglePopUp = () => {
    setPopUpOpen((prev) => !prev);
  };
  const createCategory = () => {
    setSelectedCategory(null);
    togglePopUp();
  };
  return (
    <div className="p-10 rounded-main bg-white border shadow w-full">
      <div className="flex items-center w-full justify-between">
        <h2 className="text-2xl text-main-blue">Categorias</h2>
        <div className="flex">
          {selectedCategory != null && (
            <>
            <Button type="UPDATE" onClick={togglePopUp} text={"CATEGORIA"} />
            </>
          )}
          <Button type="ADD" onClick={createCategory} text={"CATEGORIA"} />
        </div>
      </div>
      <div className="flex mt-5 gap-4 w-full pb-5 px-5 overflow-x-scroll h-[86px] items-center scrollbar-thin scrollbar-thumb-main-color scrollbar-track-main-bg-color scrollbar-rounded-[40px]">
        <div onClick={() => setSelectedCategory(null)}>
          <CategoryLabel
            name={"Todos"}
            className={selectedCategory === null ? "bg-main" : ""}
            selected={selectedCategory === null ? true : false}
          ></CategoryLabel>
        </div>
        {categories.map((category) => (
          <div key={category.id} onClick={() => setSelectedCategory(category)}>
            <CategoryLabel
              name={category.name}
              selected={selectedCategory === category ? true : false}
            ></CategoryLabel>
          </div>
        ))}
      </div>
      <div className="w-80">
        <PopUp isOpen={isPopUpOpen} onClose={togglePopUp}>
          <CategoryCreateForm onClose={togglePopUp} setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} handleReloadCategories={handleReloadCategories}></CategoryCreateForm>
        </PopUp>
      </div>
    </div>
  );
};

export default Categories;
