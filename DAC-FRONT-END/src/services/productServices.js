import DAC_API from '../api/db-connection'; // Asegúrate de usar la ruta correcta
import { handleApiError } from '../api/errorHandler';

export const ProductService = {
    createProduct: async (productData) => {
        try {
            const response = await DAC_API.post('/product/create-product', productData);
            return response.data;
        } catch (error) {
            const errorMessage = handleApiError(error);
            console.error('Error al crear el producto:', errorMessage);
            throw new Error(errorMessage);
        }
    },
    getProductsByCompanyId: async (company_id, page, itemsPerPage) => {
        try {
            const response = await DAC_API.get('/product/get-products/', { 
                params: { company_id, page, itemsPerPage },
            });
            return response.data;
        } catch (error) {
            const errorMessage = handleApiError(error);
            console.error('Error al obtener los productos:', errorMessage);
            throw new Error(errorMessage);
        }
    },
    // Otros métodos relacionados con productos (si es necesario)
};
