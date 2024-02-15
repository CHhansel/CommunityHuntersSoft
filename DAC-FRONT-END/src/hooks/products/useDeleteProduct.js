import { useState } from "react";
import { ProductService } from "../../services/productServices";

export const useDeleteProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteProductById = async (productId) => {
    setIsLoading(true);
    try {
      const response = await ProductService.deleteProductById(productId);
      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      throw error;
    }
  };

  return { deleteProductById, isLoading, error };
};
