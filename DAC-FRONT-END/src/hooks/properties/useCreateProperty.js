// hooks/useCreateProperty.js
import { useState } from 'react';
import { PropertyService } from '../../services/propertyServices';


export const useCreateProperty = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createProperty = async (propertyData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await PropertyService.createProperty(propertyData);
            return response;  
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { createProperty, isLoading, error };
};
