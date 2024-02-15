import React, { useState } from "react";
import OrderSelection from "./OrderSelection";
import OrderResume from "./OrderResume";
import { useFetchProductsByCompanyId } from "../../../../hooks/products/useFetchProducts";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../store/authSlice";

const CreateOrders = () => {
  const { user } = useSelector(selectUser);
  const [productsInOrder, setProductsInOrder] = useState([]);
  const [productUniqueId, setProductUniqueId] = useState(0);
  const [orderDetails, setOrderDetails] = useState({
    userId: user.id, 
    orderType: "", 
    products: [], // Lista de productos con id, cantidad y comentario
  });
  const [reloadTrigger, setReloadTrigger] = useState(0);
  // Obtener los productos
  const {
    productsData: { products, totalProducts },
    isLoading: isLoadingProducts,
    error: productsError,
  } = useFetchProductsByCompanyId(user.company_id, 1, 10, reloadTrigger);

  const addProductToOrder = (item, comment = "") => {
  
    // Crear un nuevo objeto de producto con un comentario opcional y un ID único
    const newProduct = { uniqueId: productUniqueId, id: item.id, comment: comment };
    
    // Actualizar el estado de productUniqueId
    setProductUniqueId(productUniqueId+1);
  
    // Agregar el nuevo producto a la lista de productos en la orden
    setOrderDetails({
      ...orderDetails,
      products: [...orderDetails.products, newProduct],
    });
  };
  
  const removeProductFromOrder = (productId) => {
    // Buscar el índice del producto con el ID dado
    const existingProductIndex = productsInOrder.findIndex(
      (product) => product.id === productId
    );

    // Verificar si el producto está en la orden
    if (existingProductIndex !== -1) {
      const updatedProductsInOrder = [...productsInOrder];

      // Obtener el producto que se va a actualizar
      const productToUpdate = updatedProductsInOrder[existingProductIndex];

      // Si la cantidad del producto es mayor que 1, disminuir la cantidad en 1
      if (productToUpdate.quantity > 1) {
        productToUpdate.quantity -= 1;
      } else {
        // Si la cantidad del producto es 1, eliminarlo de la orden
        updatedProductsInOrder.splice(existingProductIndex, 1);
      }

      // Actualizar el estado con la lista de productos modificada
      setProductsInOrder(updatedProductsInOrder);
      console.log("la orden es ", productsInOrder);
    }
  };
  return (
    <div className="w-full px-16 flex flex-row h-full gap-5">
      <div className="w-3/6">
        <OrderSelection
          products={products}
          addProductToOrder={addProductToOrder}
        ></OrderSelection>
      </div>
      <div className="w-3/6">
        <OrderResume
          products={products}
          orderDetails={orderDetails}
          removeProductFromOrder={removeProductFromOrder}
        ></OrderResume>
      </div>
    </div>
  );
};

export default CreateOrders;
