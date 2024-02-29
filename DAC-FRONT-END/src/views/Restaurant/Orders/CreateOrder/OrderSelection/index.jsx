import Swal from "sweetalert2";

import { useAlert } from "../../../../../components/Notifications/MySwalNotification";
import ProductForOrderView from "../../../../../components/productForOrderView";
import { useState } from "react";
import { useFetchCategories } from "../../../../../hooks/categories/useFetchCategories";
import { useFetchRelationsProductCategory } from "../../../../../hooks/categories/useFetchRelationsProdCat";
import { selectUser } from "../../../../../store/authSlice";
import { useSelector } from "react-redux";

const OrderSelection = ({ products, addProductToOrder }) => {
  const showToast = useAlert();
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const { user } = useSelector(selectUser);
  const {
    categoriesData: { categories, totalCategories },
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useFetchCategories(user.company_id, reloadTrigger);

  // Obtener las relaciones entre productos y categorías
  const {
    relationsData: { relations },
    loading: isLoadingRelations,
    error: relationsError,
  } = useFetchRelationsProductCategory(user.company_id, reloadTrigger);
  const handleReloadCategories = () => {
    setReloadTrigger((prev) => !prev); // Esto recargará las mesas cuando se llame
  };
  const addProduct = async (item) => {
    const result = await Swal.fire({
      title: `Desea agregar ${item.name} a la orden`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
    });
    if (result.isConfirmed) {
      try {
        addProductToOrder(item);
        showToast("success", "Producto agregado!");
      } catch (err) {
        console.error("Error agregando producto:", err);
      }
    }
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Actualizar el estado con el valor del campo de búsqueda
  };
  // Filtrar los productos por el término de búsqueda
  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      product.internal_code.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
  });
  
  // Agrupar productos por categoría utilizando `relations` y `categories`
const productsByCategory = relations.reduce((acc, relation) => {
  const product = products.find((p) => p.id === relation.product_id);
  const category = categories.find((c) => c.id === relation.category_id);
  if (product && category) {
    if (!acc[category.id]) {
      acc[category.id] = { category: category.name, products: [] };
    }
    acc[category.id].products.push(product);
  }
  return acc;
}, {});

// Filtrar categorías y productos después de haberlos agrupado por categorías
const filteredCategories = Object.values(productsByCategory).reduce((acc, category) => {
  // Solo incluir productos que coincidan con el término de búsqueda dentro de cada categoría
  const matchedProducts = category.products.filter(
    (product) =>
      product.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      product.internal_code.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  // Solo incluir categorías que tengan al menos un producto que coincida
  if (matchedProducts.length > 0) {
    acc.push({ ...category, products: matchedProducts });
  }

  return acc;
}, []);

  return (
    <div className="p-10 my-5 rounded-main bg-white border shadow overflow-y-scroll max-h-[80vh] scrollbar-thin scrollbar-thumb-main-color scrollbar-track-main-bg-color scrollbar-rounded-[40px]">
      <div className="">
        <div className=" mb-5">
          <label htmlFor="">Buscar: </label>
          <input
            className="input-text"
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        {filteredCategories.map((category) => (
          <div key={category.category} className="mt-10">
            <h3 className="text-xl font-bold">{category.category}</h3>
            <div className="flex flex-row flex-wrap gap-5 justify-evenly ">
              <div className="w-full h-[3px] bg-main-color mt-1"></div>
              {category.products.map((item) => (
                <div key={item.id} onClick={() => addProduct(item)} className="cursor-grab">
                  <ProductForOrderView product={item}></ProductForOrderView>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSelection;
