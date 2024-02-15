import { useState } from "react";
import { CategoryService } from "../../services/categoryServices";

export const useInsertProductCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const insertProductCategory = async (categoryData) => {
    setIsLoading(true);
    try {
      const response = await CategoryService.insertProductCategory(categoryData);
      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      throw error;
    }
  };

  return { insertProductCategory, isLoading, error };
};
