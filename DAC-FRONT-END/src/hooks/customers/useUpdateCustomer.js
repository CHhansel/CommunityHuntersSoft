import { useState } from 'react';
import { CustomerService } from '../../services/customerServices';

export const useUpdateCustomer = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateCustomer = async (customerData) => {
        setLoading(true);

        try {
            const response = await CustomerService.updateCustomer(customerData);
            return response; // Si es exitoso, simplemente retornamos la respuesta.
        } catch (err) {
            setError(err.message); // Establecemos el error.
            throw err; // Lanzamos el error para que pueda ser capturado por quien llama la función.
        } finally {
            setLoading(false);
        }
    };

    return { updateCustomer, isLoading, error };
};

