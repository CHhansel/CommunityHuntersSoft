import { useState } from 'react';
import { TableService } from '../../services/tables'; // Asegúrate de usar la ruta correcta

export const useDeleteTable = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteTableById = async (tableId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await TableService.deleteRestaurantTableById(tableId);
            return response;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { deleteTableById, isLoading, error };
};
