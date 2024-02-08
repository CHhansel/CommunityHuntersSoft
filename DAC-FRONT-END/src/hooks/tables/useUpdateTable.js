import { useState } from 'react';
import { TableService } from '../../services/tables'; // Asegúrate de usar la ruta correcta

export const useUpdateTable = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateTable = async (tableId, tableData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await TableService.updateRestaurantTable(tableId, tableData);
            return response;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { updateTable, isLoading, error };
};
