import DAC_API from "../api/db-connection"; // Asegúrate de usar la ruta correcta
import { handleApiError } from "../api/errorHandler";

export const CategoryService = {
  getCategoriesByCompanyId: async (company_id) => {
    try {
      // Asumiendo que el ID de la compañía se envía como un parámetro de consulta
      const response = await DAC_API.get(
        `/categories/get-categories/?company_id=${company_id}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al obtener las categorías:", errorMessage);
      throw new Error(errorMessage);
    }
  },
  // Insertar una nueva categoría de producto
  insertProductCategory: async (categoryData) => {
    try {
      const response = await DAC_API.post(
        "/categories/create-category",
        categoryData
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(
        "Error al insertar la categoría de producto:",
        errorMessage
      );
      throw new Error(errorMessage);
    }
  },
  updateProductCategory: async (categoryId, categoryData) => {
    try {
      const response = await DAC_API.patch(`/categories/update-category/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al actualizar la categoría de producto:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  deleteProductCategoryById: async (id) => {
    console.log(id);
    try {
      const response = await DAC_API.delete(`/categories/delete-category/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al eliminar la categoría de producto:", errorMessage);
      throw new Error(errorMessage);
    }
  },
  getRelationsByCompanyId: async (company_id) => {
    try {
      // Asumiendo que el ID de la compañía se envía como un parámetro de consulta
      const response = await DAC_API.get(
        `/categories/get-relations/?company_id=${company_id}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al obtener las relaciones:", errorMessage);
      throw new Error(errorMessage);
    }
  },
  // Otros métodos relacionados con categorías (si es necesario)
};

export default CategoryService;
