import { useState } from "react";
import { ProductService } from "../../services/productServices"; // Importa el servicio necesario

export const useUpdateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProduct = async (categoryId, categoryData) => {
    setIsLoading(true);
    try {
      const response = await ProductService.updateProductById(categoryId, categoryData); // Invoca el método del servicio
      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      throw new Error("Error al actualizar la categoría del producto");
    }
  };

  return { updateProduct, isLoading, error };
};
