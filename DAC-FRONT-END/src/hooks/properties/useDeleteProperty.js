// hooks/useDeleteProperty.js
import { useState } from 'react';
import { PropertyService } from '../../services/propertyServices';

export const useDeleteProperty = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteProperty = async (product_Id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await PropertyService.deleteProperty(product_Id);
            return response;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { deleteProperty, isLoading, error };
};
