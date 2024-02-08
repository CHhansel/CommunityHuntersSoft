import { useState } from "react";
import { CategoryService } from "../services/CategoryService";

export const useDeleteProductCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteProductCategoryById = async (categoryId) => {
    setIsLoading(true);
    try {
      const response = await CategoryService.deleteProductCategoryById(categoryId);
      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      throw error;
    }
  };

  return { deleteProductCategoryById, isLoading, error };
};

