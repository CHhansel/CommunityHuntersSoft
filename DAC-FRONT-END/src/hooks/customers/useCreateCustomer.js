// hooks/useCreateCustomer.js
import { useState } from 'react';
import { CustomerService } from '../../services/customerServices';

export const useCreateCustomer = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createCustomer = async (customerData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await CustomerService.createCustomer(customerData);
            return response;  
        } catch (err) {
            setError(err.message);
            throw err; // Lanzamos el error para que pueda ser capturado por quien llama la función.
        } finally {
            setLoading(false);
        }
    };

    return { createCustomer, isLoading, error };
};

export default useCreateCustomer;
