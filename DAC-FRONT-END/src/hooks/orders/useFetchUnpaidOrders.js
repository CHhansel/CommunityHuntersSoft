import { useState, useEffect, useCallback } from 'react';
import { OrderService } from '../../services/OrderServices';

export const useFetchUnpaidOrders = (companyId) => {
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
  }, [companyId]);

  useEffect(() => {
    fetchUnpaidOrders();
  }, [fetchUnpaidOrders]);

  return { ordersData, loading, error };
};
