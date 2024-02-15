import DAC_API from "../api/db-connection";
import { handleApiError } from "../api/errorHandler";

export const ProductService = {
  createProduct: async (productData) => {
    try {
      const response = await DAC_API.post(
        "/product/create-product",
        productData
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al crear el producto:", errorMessage);
      throw new Error(errorMessage);
    }
  },
  getProductsByCompanyId: async (company_id, page, itemsPerPage) => {
    try {
      const response = await DAC_API.get("/product/get-products/", {
        params: { company_id, page, itemsPerPage },
      });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al obtener los productos:", errorMessage);
      throw new Error(errorMessage);
    }
  },
  deleteProductById: async (productId) => {
    try {
      const response = await DAC_API.delete(
        `/product/delete-product/${productId}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al eliminar el producto:", errorMessage);
      throw new Error(errorMessage);
    }
  },
  updateProductById: async (productId, productData) => {
    try {
      const response = await DAC_API.patch(
        `/product/update-product/${productId}`,
        productData
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al actualizar el producto:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};
