import { useState } from 'react';
import { OrderService } from '../../services/OrderServices';

const useUpdateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateOrder = async (orderId, updatedOrderData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await OrderService.updateOrder(orderId, updatedOrderData);
      setLoading(false);
      return response;
    } catch (error) {
      console.error('Error al actualizar la orden:', error.message);
      setError(error.message);
      setLoading(false);
      throw new Error(error.message);
    }
  };

  return { updateOrder, loading, error };
};

export default useUpdateOrder;
