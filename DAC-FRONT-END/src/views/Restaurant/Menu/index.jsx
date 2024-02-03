import React, { useState } from "react";

import Categories from "./Categories";
import { useFetchCategories } from "../../../hooks/categories/useFetchCategories";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store/authSlice";
import Products from "./Product";
import { useFetchProductsByCompanyId } from "../../../hooks/products/useFetchProducts";

const Menu = () => {
  const { user } = useSelector(selectUser);

  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Obtener las categorías
  const {
    categoriesData: { categories, totalCategories },
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useFetchCategories(user.company_id, reloadTrigger);

  // Obtener los productos
  const {
    productsData: { products, totalProducts },
    isLoading: isLoadingProducts,
    error: productsError,
  } = useFetchProductsByCompanyId(user.company_id,1,10, reloadTrigger);

  return (
    <div className="px-16">
      <div>
      <Categories categories={categories} selectedCategory={selectedCategory}></Categories>

      </div>
      <div className="mt-5">
       <Products></Products>

      </div>
    </div>
  
  );
};

export default Menu;
