import DAC_API from '../api/db-connection';  // Asegúrate de usar la ruta correcta
import dniTypes from '../utils/tiposIdentificacionCR.json';
export const CustomerService = {
    getCustomers: async (company_id, page, itemsPerPage) => {
        try {
            const response = await DAC_API.get(`/customer/get-customers`, { 
                params: { company_id, page, itemsPerPage },

            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
            throw error;
        }
    }
};

export const DniTypeService = {
    getDniTypes: async () => {
        try {
            
            return dniTypes;
        } catch (error) {
            console.error('Error al obtener los tipos de DNI:', error);
            throw error;
        }
    }
};