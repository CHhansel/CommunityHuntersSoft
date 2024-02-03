import { useState } from 'react';
import { ProductService } from '../../services/productServices'; // Asegúrate de usar la ruta correcta

export const useCreateProduct = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createProduct = async (productData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await ProductService.createProduct(productData);
            return response;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { createProduct, isLoading, error };
};
