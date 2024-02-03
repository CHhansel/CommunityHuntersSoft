import DAC_API from '../api/db-connection'; // Asegúrate de usar la ruta correcta
import { handleApiError } from '../api/errorHandler';

export const CategoryService = {
    getCategoriesByCompanyId: async (company_id) => {
        try {
            // Asumiendo que el ID de la compañía se envía como un parámetro de consulta
            const response = await DAC_API.get(`/categories/get-categories/?company_id=${company_id}`);
            return response.data;
        } catch (error) {
            const errorMessage = handleApiError(error);
            console.error('Error al obtener las categorías:', errorMessage);
            throw new Error(errorMessage);
        }
    },
    // Otros métodos relacionados con categorías (si es necesario)
};

export default CategoryService;
