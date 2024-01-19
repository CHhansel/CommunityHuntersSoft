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
        } finally {
            setLoading(false);
        }
    };

    return { createCustomer, isLoading, error };
};

export default useCreateCustomer;
