import Swal from "sweetalert2";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useAlert } from "../../../components/Notifications/MySwalNotification";
import ProductForOrderView from "../../../components/productForOrderView";
import { useFetchCategories } from "../../../hooks/categories/useFetchCategories";
import { useFetchRelationsProductCategory } from "../../../hooks/categories/useFetchRelationsProdCat";
import { selectUser } from "../../../store/authSlice";
import ProductForOrderViewNoImage from "../../../components/ProductForOrderViewNoImage";

const ProductsSelector = ({ products, selectProduct }) => {
  const showToast = useAlert();
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [reloadTrigger] = useState(0);
  const { user } = useSelector(selectUser);
  const [showImages, setShowImages] = useState(false); // Por defecto, mostrar imágenes

  const {
    categoriesData: { categories },
  } = useFetchCategories(user.company_id, reloadTrigger);

  // Obtener las relaciones entre productos y categorías
  const {
    relationsData: { relations },
  } = useFetchRelationsProductCategory(user.company_id, reloadTrigger);

  const addProduct = async (item) => {
    const result = await Swal.fire({
      title: `Desea agregar ${item.name} a la orden`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
    });
    if (result.isConfirmed) {
      try {
        selectProduct(item);
        showToast("success", "Producto agregado!");
      } catch (err) {
        console.error("Error agregando producto:", err);
      }
    }
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Actualizar el estado con el valor del campo de búsqueda
  };

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
  const filteredCategories = Object.values(productsByCategory).reduce(
    (acc, category) => {
      // Solo incluir productos que coincidan con el término de búsqueda dentro de cada categoría
      const matchedProducts = category.products.filter(
        (product) =>
          product.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
          product.internal_code
            .toLowerCase()
            .startsWith(searchTerm.toLowerCase())
      );

      // Solo incluir categorías que tengan al menos un producto que coincida
      if (matchedProducts.length > 0) {
        acc.push({ ...category, products: matchedProducts });
      }

      return acc;
    },
    []
  );

  return (
    <div className="box-style h-full scrollbar-thin scrollbar-thumb-main-color scrollbar-track-main-bg-color scrollbar-rounded-[40px]">
      <div className="">
        <div className="flex justify-between">
          <div className=" mb-5">
            <label htmlFor="">Buscar: </label>
            <input
              className="input-text"
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="mb-5 flex items-center">
            <label htmlFor="toggleImages">Mostrar imágenes:</label>
            <input
              id="toggleImages"
              type="checkbox"
              checked={showImages}
              onChange={() => setShowImages(!showImages)}
              className="m-2"
            />
          </div>
        </div>
        {filteredCategories.map((category) => (
          <div key={category.category} className="mt-10">
            <h3 className="text-xl font-bold">{category.category}</h3>
            <div className="flex flex-row flex-wrap gap-3 justify-evenly ">
              <div className="w-full h-[3px] bg-main-color mt-1"></div>
              {category.products.map((item) => (
                <div
                  key={item.id}
                  onClick={() => addProduct(item)}
                  className={`cursor-pointer  ${showImages ? '' : 'w-full'}`}
                >
                  {showImages ? (
                    <ProductForOrderView product={item}></ProductForOrderView>
                  ) : (
                    <ProductForOrderViewNoImage
                      product={item}
                    ></ProductForOrderViewNoImage>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <p className="mt-12">Cantidad de Productos: {products.length}</p>
      </div>
    </div>
  );
};

export default ProductsSelector;
