// hooks/useFetchProperties.js
import { useState, useEffect, useCallback } from 'react';
import { PropertyService } from '../../services/propertyServices';

export const useFetchProperties = (companyId, page, itemsPerPage) => {
    const [propertyData, setPropertyData] = useState({ properties: [], totalProperties: 0 });

    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProperties = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await PropertyService.getPropertiesByCompanyId(
                companyId, page, itemsPerPage
            );
            setPropertyData({ properties: data.properties, totalProperties: data.totalProperties });

        } catch (err) {
            setError(err.message); // Aquí 'err.message' ya está procesado por 'handleApiError'

        } finally {
            setLoading(false);
        }
    }, [companyId, page, itemsPerPage]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    return { propertyData, isLoading, error };
};
