import { useState, useEffect, useCallback } from "react";
import CategoryService from "../../services/categoryServices";

export const useFetchCategories = (company_id, reloadTrigger) => {
  const [categoriesData, setCategoriesData] = useState({
    categories: [],
    totalCategories: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await CategoryService.getCategoriesByCompanyId(company_id);
      setCategoriesData({ categories: data.categories, totalCategories: data.totalCategories });
    } catch (err) {
      setError(err);
      throw err; // Lanzamos el error para que pueda ser capturado por quien llama la función.
    } finally {
      setIsLoading(false);
    }
  }, [company_id]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, reloadTrigger]);

  return { categoriesData, isLoading, error };
};
