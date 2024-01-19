import DAC_API from '../api/db-connection';  // Asegúrate de usar la ruta correcta
import { handleApiError } from '../api/errorHandler';
import dniTypes from '../utils/tiposIdentificacionCR.json';


export const CustomerService = {
    getCustomers: async (company_id, page, itemsPerPage) => {
        try {
            const response = await DAC_API.get(`/customer/get-customers`, { 
                params: { company_id, page, itemsPerPage },

            });
            return response.data;
        } catch (error) {
            const errorMessage = handleApiError(error);
            console.error('Error al obtener los clientes:', errorMessage);
            throw new Error(errorMessage);
        }
    },
    createCustomer: async (customerData) => {
        try {
            const response = await DAC_API.post('/customer/create-customer', customerData);
            return response.data;
        } catch (error) {
            const errorMessage = handleApiError(error);
            console.error('Error al crear el cliente:', errorMessage);
            throw new Error(errorMessage);
        }
    },
    deleteCustomer: async (customer_id) => {
        try {
            const response = await DAC_API.delete(`/customer/delete-customer/${customer_id}`);
            return response.data;
        } catch (error) {
            const errorMessage = handleApiError(error);
            console.error('Error al eliminar el cliente:', errorMessage);
            throw new Error(errorMessage);
        }
    },
    updateCustomer: async (customerData) => {
        try {
            const response = await DAC_API.patch(`/customer/update-customer/${customerData.customer_id}`, customerData);
            return response.data;
        } catch (error) {
            const errorMessage = handleApiError(error);
            console.error('Error al actualizar el cliente:', errorMessage);
            throw new Error(errorMessage);
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