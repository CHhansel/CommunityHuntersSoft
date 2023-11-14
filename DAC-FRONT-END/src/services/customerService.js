import DAC_API from '../api/db-connection';  // Asegúrate de usar la ruta correcta

export const CustomerService = {
    getCustomers: async (token,company_id, page, itemsPerPage) => {
        try {
            const response = await DAC_API.get(`/customer/get-customers`, { 
                params: { company_id, page, itemsPerPage },
                headers: { 'Authorization': token }
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
            throw error;
        }
    }
};

export const DniTypeService = {
    getDniTypes: async (token) => {
        try {
            const response = await DAC_API.get('/customer/get-dni_types/', { 
                headers: { 'Authorization': token }
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener los tipos de DNI:', error);
            throw error;
        }
    }
};
