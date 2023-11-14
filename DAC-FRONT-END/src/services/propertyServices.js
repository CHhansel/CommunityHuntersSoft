import DAC_API from '../api/db-connection';  // Asegúrate de usar la ruta correcta

export const PropertyService = {
    getPropertiesByCompanyId: async (token, companyId, page, itemsPerPage) => {
        try {
            const response = await DAC_API.get('/property/get-properties/', { 
                params: { id: companyId, page, itemsPerPage },
                headers: { 'Authorization': token }
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener las propiedades:', error);
            throw error;
        }
    }
};
