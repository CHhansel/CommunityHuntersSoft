import { useState } from 'react';
import TableService from '../../services/tables';


export const useCreateRestaurantTable = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createRestaurantTable = async (tableData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await TableService.createRestaurantTable(tableData);
            return response;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { createRestaurantTable, isLoading, error };
};
