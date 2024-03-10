import { useState, useEffect, useCallback } from 'react';
import { OrderService } from '../../services/OrderServices';

export const useFetchUnpaidOrders = (companyId, reloadOrders) => { // Añadir reloadOrders como segundo parámetro
  const [ordersData, setOrdersData] = useState({
    orders: [],
    totalOrders: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUnpaidOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await OrderService.getUnpaidOrders(companyId);
      setOrdersData({ orders: data.orders, totalOrders: data.totalOrders });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [companyId]); // El callback solo depende de companyId

  useEffect(() => {
    fetchUnpaidOrders();
  }, [fetchUnpaidOrders, reloadOrders]); // Añadir reloadOrders a las dependencias

  return { ordersData, loading, error };
};
