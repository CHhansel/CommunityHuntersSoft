// hooks/useCreateOrder.js
import { useState } from 'react';
import { OrderService } from '../../services/OrderServices'; // Asegúrate de ajustar la ruta según tu estructura de carpetas

export const useCreateOrder = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createOrder = async (orderData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await OrderService.createOrder(orderData);
            return response;  
        } catch (err) {
            setError(err.message);
            throw err; // Lanzamos el error para que pueda ser capturado por quien llama la función.
        } finally {
            setLoading(false);
        }
    };

    return { createOrder, isLoading, error };
};

export default useCreateOrder;
