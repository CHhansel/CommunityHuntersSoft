import { useState, useEffect, useCallback } from "react";
import { OrderService } from "../../services/OrderServices";

const useFetchOrdersPaginated = (company_id, page, itemsPerPage, reloadTrigger) => {
    const [ordersData, setOrdersData] = useState({
        orders: [],
        totalOrders: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await OrderService.getOrdersPaginated(company_id, page, itemsPerPage);
            setOrdersData({ orders: data.orders, totalOrders: data.totalOrders });
        } catch (err) {
            setError(err);
            throw err; // Lanzamos el error para que pueda ser capturado por quien llama la función.
        } finally {
            setLoading(false);
        }
    }, [company_id, page, itemsPerPage]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders, reloadTrigger]);

    return { ordersData, loading, error };
};

export default useFetchOrdersPaginated;
