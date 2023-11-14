import DAC_API from '../api/db-connection'; // Asegúrate de usar la ruta correcta

export const CompanyCredentialsService = {
    // Obtener credenciales por company_id
    getCredentialsByCompanyId: async (company_id) => {
        try {
            const response = await DAC_API.get(`/companyCredentials/${company_id}`);
            return response.data.credentials;
        } catch (error) {
            console.error('Error al obtener las credenciales:', error);
            throw error;
        }
    },

    // Crear nuevas credenciales
    createCredentials: async (credentialsData) => {
        try {
            const response = await DAC_API.post(`/companyCredentials`, credentialsData);
            return response.data;
        } catch (error) {
            console.error('Error al crear las credenciales:', error);
            throw error;
        }
    },
};
export const CompanyService = {
    // Actualizar datos de la compañía
    updateCompany: async (companyId, companyData) => {
        try {
            const response = await DAC_API.put(`/company/${companyId}`, companyData);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar la compañía:', error);
            throw error;
        }
    },
};