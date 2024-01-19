// hooks/useFetchProperties.js
import { useState, useEffect, useCallback } from "react";
import { PropertyService } from "../../services/propertyServices";

export const useFetchProperties = (
  company_id,
  page,
  itemsPerPage,
  reloadTrigger
) => {
  const [propertyData, setPropertyData] = useState({
    properties: [],
    totalProperties: 0,
  });

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await PropertyService.getPropertiesByCompanyId(
        company_id,
        page,
        itemsPerPage
      );
      setPropertyData({
        properties: data.properties,
        totalProperties: data.totalProperties,
      });
    } catch (err) {
      setError(err.message); // Aquí 'err.message' ya está procesado por 'handleApiError'
    } finally {
      setLoading(false);
    }
  }, [company_id, page, itemsPerPage]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties, reloadTrigger]); // Añadir reloadTrigger como dependencia

  return { propertyData, isLoading, error };
};
