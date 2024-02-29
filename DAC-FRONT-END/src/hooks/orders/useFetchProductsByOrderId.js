import { useState, useEffect } from "react";
import { OrderService } from "../../services/OrderServices";

export const useFetchProductsByOrderId = (orderId) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await OrderService.getProductsByOrderId(orderId);
        setProducts(data.products);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [orderId]);

  return { products, loading, error };
};
