import DAC_API from "../api/db-connection"; // Asegúrate de usar la ruta correcta
import { handleApiError } from "../api/errorHandler";

export const EmployeeService = {
  // Método para crear un empleado
  createEmployee: async (employeeData) => {
    try {
      const response = await DAC_API.post(
        "/employee/create-employee",
        employeeData
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al crear el empleado:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Método para eliminar un empleado
  deleteEmployee: async (employeeId) => {
    try {
      const response = await DAC_API.delete(
        `/employee/delete-employee/${employeeId}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al eliminar el empleado:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Método para actualizar un empleado
  updateEmployee: async (employeeId, employeeData) => {
    try {
      const response = await DAC_API.patch(
        `/employee/update-employee/`,
        employeeData
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al actualizar el empleado:", errorMessage);
      throw new Error(errorMessage);
    }
  },
  // Método para obtener empleados por company_id
  getEmployeesByCompanyId: async (company_id, page, itemsPerPage) => {
    try {
      const response = await DAC_API.get("/employee/get-employees", {
        params: { company_id, page, itemsPerPage },
      });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al obtener los empleados:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};

export default EmployeeService;
