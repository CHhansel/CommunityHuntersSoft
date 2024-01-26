import { useState, useEffect, useCallback } from 'react';
import { RoleService } from '../../services/roleServices';

export const useFetchRoles = (company_id, page, itemsPerPage, reloadTrigger) => {
  const [rolesData, setRolesData] = useState({
    roles: [],
    totalRoles: 0,
  });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await RoleService.getRolesByCompanyId(company_id, page, itemsPerPage);
      setRolesData({
        roles: data.roles,
        totalRoles: data.totalRoles,
      });
    } catch (err) {
      setError(err.message); // Aquí 'err.message' ya está procesado por 'handleApiError'
    } finally {
      setLoading(false);
    }
  }, [company_id, page, itemsPerPage]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles, reloadTrigger]); // Añadir reloadTrigger como dependencia

  return { rolesData, isLoading, error };
};
