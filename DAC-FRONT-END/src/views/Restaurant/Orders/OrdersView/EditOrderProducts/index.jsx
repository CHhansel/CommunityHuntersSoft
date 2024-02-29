import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { useFetchProductsByCompanyId } from "../../../../../hooks/products/useFetchProducts";
import { selectUser } from "../../../../../store/authSlice";
import OrderEditResume from "./OrderEditResume";
import OrderSelection from "../../CreateOrder/OrderSelection";
import { useFetchProductsByOrderId } from "../../../../../hooks/orders/useFetchProductsByOrderId";
import { useFetchOrderWithProducts } from "../../../../../hooks/orders/useFetchOrderWithProducts ";

const EditOrderProducts = () => {
  const { user } = useSelector(selectUser);
  let { ordenId } = useParams();

  const [productUniqueId, setProductUniqueId] = useState(0);

  const [orderDetails, setOrderDetails] = useState({
    company_id: user.company_id,
    type: "",
    products: [], // Lista de productos con id, cantidad y comentario
  });
  // Llama al hook y pasa el id de la orden
  const { products: actualProducts } = useFetchProductsByOrderId(ordenId);
  const { orderWithProducts  } = useFetchOrderWithProducts(ordenId);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  // Obtener los productos
  const {
    productsData: { products, totalProducts },
    isLoading: isLoadingProducts,
    error: productsError,
  } = useFetchProductsByCompanyId(user.company_id, 1, 30, reloadTrigger);
  
  
  const addProductToOrder = (item, comment = "") => {
    // Crear un nuevo objeto de producto con un comentario opcional y un ID único
    const newProduct = {
      uniqueId: productUniqueId,
      id: item.id,
      comment: comment,
    };

    // Actualizar el estado de productUniqueId
    setProductUniqueId(productUniqueId + 1);

    // Agregar el nuevo producto a la lista de productos en la orden
    setOrderDetails({
      ...orderDetails,
      products: [...orderDetails.products, newProduct],
    });
  };

  const removeProductFromOrder = (productId, uniqueId) => {
    // Filtrar la lista de productos en la orden para eliminar el producto específico
    const updatedProductsInOrder = orderDetails.products.filter(
      (product) => product.id !== productId || product.uniqueId !== uniqueId
    );

    // Actualizar el estado con la lista de productos modificada
    setOrderDetails({
      ...orderDetails,

      products: updatedProductsInOrder,
    });
  };
  const addCommentToProduct = (uniqueId, comment) => {
    // Buscar el índice del producto en la orden
    const productIndex = orderDetails.products.findIndex(
      (product) => product.uniqueId === uniqueId
    );

    // Verificar si el producto está en la orden
    if (productIndex !== -1) {
      // Copiar el producto existente
      const updatedProduct = { ...orderDetails.products[productIndex] };

      // Actualizar el comentario del producto
      updatedProduct.comment = comment;

      // Actualizar la lista de productos en la orden con el producto actualizado
      const updatedProducts = [...orderDetails.products];
      updatedProducts[productIndex] = updatedProduct;

      // Actualizar el estado con la lista de productos modificada
      setOrderDetails({
        ...orderDetails,
        products: updatedProducts,
      });
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
        <OrderEditResume
          products={products}
          orderDetails={orderDetails}
          removeProductFromOrder={removeProductFromOrder}
          addCommentToProduct={addCommentToProduct}
        ></OrderEditResume>
      </div>
    </div>
  );
};

export default EditOrderProducts;
