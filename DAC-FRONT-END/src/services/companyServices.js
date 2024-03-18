import DAC_API from "../api/db-connection"; // Asegúrate de usar la ruta correcta

export const CompanyCredentialsService = {
  // Obtener credenciales por company_id
  getCredentialsByCompanyId: async (company_id) => {
    try {
      const response = await DAC_API.get(`company/get-company-credentials/${company_id}`);
      // Verificar el status en la respuesta
      if (response.data.status === 1) {
        // Si status es 1, las credenciales existen
        return response.data.status; 
      } else {
        // Si status es 0, las credenciales no existen
        console.log("No se encontraron credenciales para el company_id proporcionado.");
        return response.data.status; 
      }
    } catch (error) {
      console.error("Error al obtener las credenciales:", error);
      throw error;
    }
  },
  

  // Crear nuevas credenciales
  createCredentials: async (credentialsData) => {
    try {
      const response = await DAC_API.post(
        `company/create-company-credentials`,
        credentialsData
      );
      return response.data;
    } catch (error) {
      console.error("Error al crear las credenciales:", error);
      throw error;
    }
  },
};
export const CompanyService = {
  // Actualizar datos de la compañía
  updateCompany: async (companyId, companyData) => {
    try {
      const response = await DAC_API.put(`/${companyId}`, companyData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar la compañía:", error);
      throw error;
    }
  },
};

export const CompanyDataService = {
  // Obtener datos de la compañía por su ID
  getCompanyDataById: async (companyId) => {
    try {
      const response = await DAC_API.get(`company/get-company-data/${companyId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener los datos de la compañía:", error);
      throw error;
    }
  },
};





