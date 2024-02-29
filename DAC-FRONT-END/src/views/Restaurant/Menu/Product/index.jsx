import React, { useState } from "react";
import PopUp from "../../../../components/popUp";
import ProductCreate from "./CreateProduct";
import Button from "../../../../components/buttons/Button";
import ProductCard from "../../../../components/productCard";

const Products = ({ products, category,categories, relations,handleReloadCategories }) => {
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  const togglePopUp = () => {
    setPopUpOpen((prev) => !prev);
  };

  const createProduct = () => {
    setSelectedProduct(null);
    togglePopUp();
  };

  const updateProduct = (product) => {
    setSelectedProduct(product); // Guarda el producto seleccionado
    togglePopUp();
  };

  // Manejar el cambio en la barra de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtrar productos según el término de búsqueda
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-10 rounded-main bg-white border shadow w-full">
      <div className="flex flex-col items-center w-full">
        {category && (
          <>
            <div className="flex items-center justify-between w-full">
              <h2 className="text-2xl text-main-blue">{category.name}</h2>
              <Button type="ADD" onClick={createProduct} text="PRODUCTO A ESTA CATEGORIA" />
            </div>
            {/* Barra de búsqueda */}
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="input-text"
            />
          </>
        )}
        {category == null && (
          <>
            <h2 className="text-2xl text-main-blue">Todos los productos</h2>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="input-text"
            />
          </>
        )}
      </div>
      <PopUp isOpen={isPopUpOpen} onClose={togglePopUp}>
        <ProductCreate
          onClose={togglePopUp}
          selectedProduct={selectedProduct}
          category={category}
          categories={categories}
          relations={relations}
          handleReloadCategories={handleReloadCategories}
        />
      </PopUp>
      <div className="flex flex-wrap gap-5 justify-evenly mt-7">
        {filteredProducts.map((item) => (
          <div className="mb-5" key={item.id} onClick={() => updateProduct(item)}>
            <ProductCard product={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
