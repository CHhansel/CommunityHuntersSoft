import { useState, useEffect, useCallback } from "react";
import TableService from "../../services/tables";

export const useFetchRestaurantTables = (company_id, reloadTrigger) => {
  const [tablesData, setTablesData] = useState({
    tables: [],
    totalTables: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRestaurantTables = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await TableService.getRestaurantTablesByCompany(company_id);
      setTablesData({
        tables: data.result,
        totalTables: data.result.length,
      });
    } catch (err) {
      setError(err);
      throw err; // Lanzamos el error para que pueda ser capturado por quien llama la función.
    } finally {
      setIsLoading(false);
    }
  }, [company_id]);

  useEffect(() => {
    fetchRestaurantTables();
  }, [fetchRestaurantTables, reloadTrigger]);

  return { tablesData, isLoading, error };
};
