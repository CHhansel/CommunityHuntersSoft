import DAC_API from "../api/db-connection"; // Asegúrate de usar la ruta correcta
import { handleApiError } from "../api/errorHandler";

export const OrderService = {
  // Método para crear una orden con productos
  createOrder: async (orderData) => {
    try {
      const response = await DAC_API.post("orders/create-order", orderData);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al crear la orden:", errorMessage);
      throw new Error(errorMessage);
    }
  },
  getOrdersPaginated: async (company_id, page, itemsPerPage) => {
    try {
      const response = await DAC_API.get(
        `/orders/get-orders/?company_id=${company_id}&page=${page}&itemsPerPage=${itemsPerPage}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al obtener las órdenes paginadas:", errorMessage);
      throw new Error(errorMessage);
    }
  },
  getProductsByOrderId: async (orderId) => {
    try {
      const response = await DAC_API.get(`/orders/${orderId}/products`);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(
        "Error al obtener los productos de la orden:",
        errorMessage
      );
      throw new Error(errorMessage);
    }
  },
  getUnpaidOrders: async (companyId) => {
    try {
      const response = await DAC_API.get(
        `/orders/unpaid-orders?company_id=${companyId}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al obtener las órdenes no pagadas:", errorMessage);
      throw new Error(errorMessage);
    }
  },
  // Método para obtener una orden con sus productos
  getOrderWithProducts: async (orderId) => {
    try {
      const response = await DAC_API.get(`/orders/get-order/${orderId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al obtener la orden con productos:", errorMessage);
      throw new Error(errorMessage);
    }
  },
  // Método para actualizar los productos asociados a una orden
  updateProductsInOrder: async (orderId, products) => {
    try {
      const response = await DAC_API.patch(`/orders/update-products-order/${orderId}`, { products });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al actualizar los productos de la orden:", errorMessage);
      throw new Error(errorMessage);
    }
  },
   // Método para actualizar una orden
   updateOrder: async (orderId, updatedOrderData) => {
    try {
      const response = await DAC_API.patch(`/orders/update-order/`, updatedOrderData);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error al actualizar la orden:", errorMessage);
      throw new Error(errorMessage);
    }
  }
  // Aquí podrías agregar más métodos relacionados con las órdenes si fuese necesario
};

export default OrderService;
