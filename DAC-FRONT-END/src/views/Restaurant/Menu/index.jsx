import React, { useEffect, useState } from "react";

import Categories from "./Categories";
import { useFetchCategories } from "../../../hooks/categories/useFetchCategories";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store/authSlice";
import Products from "./Product";
import { useFetchProductsByCompanyId } from "../../../hooks/products/useFetchProducts";
import { useFetchRelationsProductCategory } from "../../../hooks/categories/useFetchRelationsProdCat";

const Menu = () => {
  const { user } = useSelector(selectUser);

  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]); // Estado para almacenar productos filtrados

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
  } = useFetchProductsByCompanyId(user.company_id, 1, 10, reloadTrigger);

  // Obtener las relaciones entre productos y categorías
  const {
    relationsData: { relations },
    loading: isLoadingRelations,
    error: relationsError,
  } = useFetchRelationsProductCategory(user.company_id, reloadTrigger);

  useEffect(() => {
    if (selectedCategory && relations && products) {
      const filteredProductIds = relations
        .filter((relation) => relation.category_id === selectedCategory.id)
        .map((relation) => relation.product_id);

      const filteredProducts = products.filter((product) =>
        filteredProductIds.includes(product.id)
      );

      setFilteredProducts(filteredProducts);
    } else {
      // Si no se ha seleccionado una categoría, muestra todos los productos
      setFilteredProducts(products);
    }
  }, [selectedCategory, relations, products]);

  console.log(products);
  return (
    <div className="px-16">
      <div>
        <Categories
          categories={categories}
          selectedCategory= {selectedCategory}
          setSelectedCategory={setSelectedCategory}
        ></Categories>
      </div>
      <div className="mt-5">
        <Products products={filteredProducts}></Products>
      </div>
    </div>
  );
};

export default Menu;
