// hooks/useDeleteCustomer.js
import { useState } from 'react';
import { CustomerService } from '../../services/customerServices';

export const useDeleteCustomer = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteCustomer = async (customerId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await CustomerService.deleteCustomer(customerId);
            return response;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { deleteCustomer, isLoading, error };
};
