import { useState, useEffect, useCallback } from "react";
import { OrderService } from "../../services/OrderServices";

const useFetchOrderWithProducts = (orderId) => {
  const [orderWithProducts, setOrderWithProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrderWithProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await OrderService.getOrderWithProducts(orderId);
      setOrderWithProducts(data.order);
    } catch (err) {
      setError(err);
      throw err; // Lanzamos el error para que pueda ser capturado por quien llama la función.
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      fetchOrderWithProducts();
    }
  }, [orderId, fetchOrderWithProducts]);

  return { orderWithProducts, loading, error };
};

export default useFetchOrderWithProducts;
