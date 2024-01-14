// hooks/useUpdateProperty.js
import { useState } from 'react';
import { PropertyService } from '../../services/propertyServices';

export const useUpdateProperty = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateProperty = async (propertyData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await PropertyService.updateProperty(propertyData);
            return response;  
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { updateProperty, isLoading, error };
};
