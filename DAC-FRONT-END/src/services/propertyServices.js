import DAC_API from '../api/db-connection';  // Asegúrate de usar la ruta correcta
import { handleApiError } from '../api/errorHandler';




export const PropertyService = {
    getPropertiesByCompanyId: async (company_id, page, itemsPerPage) => {
        try {
            const response = await DAC_API.get('/property/get-properties/', { 
                params: { company_id, page, itemsPerPage },
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
            const response = await DAC_API.post('/property/create-property', propertyData);
            return response.data;
        } catch (error) {
            const errorMessage = handleApiError(error);
            console.error('Error al crear la propiedad:', errorMessage);
            throw new Error(errorMessage);
        }
    },
    updateProperty: async (propertyData) => {
        try {
            const response = await DAC_API.patch('/property/update-property', propertyData);
            return response.data;
        } catch (error) {
            const errorMessage = handleApiError(error);
            console.error('Error al actualizar la propiedad:', errorMessage);
            throw new Error(errorMessage);
        }
    },
    deleteProperty: async (productId) => {
        try {
            const response = await DAC_API.delete(`/property/delete-property/${productId}`);
            return response.data;
        } catch (error) {
            const errorMessage = handleApiError(error);
            console.error('Error al eliminar la propiedad:', errorMessage);
            throw new Error(errorMessage);
        }
    },
};