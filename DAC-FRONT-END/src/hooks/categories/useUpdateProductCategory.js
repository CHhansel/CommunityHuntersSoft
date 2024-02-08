import { useState } from "react";
import { CategoryService } from "../services/CategoryService";

export const useUpdateProductCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProductCategory = async (categoryId, categoryData) => {
    setIsLoading(true);
    try {
      const response = await CategoryService.updateProductCategory(categoryId, categoryData);
      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      throw error;
    }
  };

  return { updateProductCategory, isLoading, error };
};
