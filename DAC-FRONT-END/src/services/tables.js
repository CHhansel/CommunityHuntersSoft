import DAC_API from "../api/db-connection"; // Asegúrate de usar la ruta correcta
import { handleApiError } from "../api/errorHandler";

export const TableService = {
  createRestaurantTable: async (tableData) => {
    try {
      const response = await DAC_API.post("/tables/create-table", tableData);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al crear la mesa de restaurante:", errorMessage);
      throw new Error(errorMessage);
    }
  },
  getRestaurantTablesByCompany: async (company_id) => {
    try {
      const response = await DAC_API.get(`/tables/get-tables/?company_id=${company_id}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al obtener las mesas de restaurante:", errorMessage);
      throw new Error(errorMessage);
    }
  },
  updateRestaurantTable: async (tableId, tableData) => {
    try {
      const response = await DAC_API.patch(`/tables/update-table/${tableId}`, tableData);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al actualizar la mesa de restaurante:", errorMessage);
      throw new Error(errorMessage);
    }
  },
  deleteRestaurantTableById: async (tableId) => {
    try {
      const response = await DAC_API.delete(`/tables/delete-table/${tableId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al eliminar la mesa de restaurante:", errorMessage);
      throw new Error(errorMessage);
    }
  },
  // Otros métodos relacionados con mesas de restaurante (si es necesario)
};

export default TableService;
