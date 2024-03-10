import { useState } from "react";
import { OrderService } from '../../services/OrderServices';

export const useUpdateProductsInOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProducts = async (orderId, products) => {
    setLoading(true);
    setError(null);

    try {
      await OrderService.updateProductsInOrder(orderId, products);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return { updateProducts, loading, error };
};



