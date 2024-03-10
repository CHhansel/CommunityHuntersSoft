import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { useFetchProductsByCompanyId } from "../../../../../hooks/products/useFetchProducts";
import { selectUser } from "../../../../../store/authSlice";
import OrderEditResume from "./OrderEditResume";
import OrderSelection from "../../CreateOrder/OrderSelection";
import { useFetchProductsByOrderId } from "../../../../../hooks/orders/useFetchProductsByOrderId";
import useFetchOrderWithProducts from "../../../../../hooks/orders/useFetchOrderWithProducts";

const EditOrderProducts = () => {
  const { user } = useSelector(selectUser);
  let { ordenId } = useParams();

  const [productUniqueId, setProductUniqueId] = useState(0);
  const [order, setOrder] = useState({})
  const [orderDetails, setOrderDetails] = useState({
    company_id: user.company_id,
    ordenId: ordenId,
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
  
  useEffect(() => {
    // Suponiendo que actualProducts tiene un campo 'productId' que queremos mapear a 'id'
    // y otros campos relevantes que también necesitamos mapear.
    let cont = 0;
    const transformedProducts = actualProducts.map(product => {
      cont++;
      // Encuentra el producto equivalente en el arreglo 'products' usando 'productId'
      const equivalentProduct = products.find(p => p.id === product.idProducto);
      
      // Si no se encuentra un producto equivalente, puedes decidir qué hacer,
      // por ejemplo, retornar un objeto con campos predeterminados o el propio producto con ajustes.
      if (!equivalentProduct) {
        return {
          uniqueId: cont, // Asume que tienes una forma de generar o incrementar este valor adecuadamente
          id: product.productId,
          comment: product.comentarios
          // Otros campos y valores predeterminados o transformaciones necesarias
        };
      }
      // Si se encuentra un producto equivalente, retorna una nueva estructura
      // que mapee los campos de 'actualProducts' a los de 'orderDetails.products'
      return {
        uniqueId: cont, // Asume que tienes una forma de generar o incrementar este valor adecuadamente
        id: equivalentProduct.id,
        comment: product.comentarios
        // Aquí puedes agregar más campos que necesites mapear, basándote en los campos disponibles en 'equivalentProduct'
      };
    });
    setProductUniqueId(++cont);
    // Actualiza el estado de orderDetails con los productos transformados
    setOrderDetails({
      ...orderDetails,
      products: transformedProducts,
    });
  }, [actualProducts, products]); // Asegúrate de incluir todas las dependencias relevantes
  
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
