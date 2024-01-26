import DAC_API from '../api/db-connection'; // Asegúrate de usar la ruta correcta
import { handleApiError } from '../api/errorHandler';

export const RoleService = {
  // Método para obtener roles por company_id y paginación
  getRolesByCompanyId: async (company_id, page, itemsPerPage) => {
    try {
      const response = await DAC_API.get('role/get-roles', {
        params: { company_id, page, itemsPerPage },
      });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error('Error al obtener los roles:', errorMessage);
      throw new Error(errorMessage);
    }
  },
};

export default RoleService;
