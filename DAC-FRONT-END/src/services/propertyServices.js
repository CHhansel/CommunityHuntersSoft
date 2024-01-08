import DAC_API from '../api/db-connection';  // Asegúrate de usar la ruta correcta
import { handleApiError } from '../api/errorHandler';




export const PropertyService = {
    getPropertiesByCompanyId: async (companyId, page, itemsPerPage) => {
        try {
            const response = await DAC_API.get('/property/get-properties/', { 
                params: { companyId, page, itemsPerPage },
            });
            return response.data;
        } catch (error) {
            const errorMessage = handleApiError(error);
            console.error('Error al obtener las propiedades:', errorMessage);
            throw new Error(errorMessage);
        }
    },
    createProperty: async (propertyData) => {
        try {
            const response = await DAC_API.post('/property/create', propertyData);
            return response.data;
        } catch (error) {
            const errorMessage = handleApiError(error);
            console.error('Error al crear la propiedad:', errorMessage);
            throw new Error(errorMessage);
        }
    },
};