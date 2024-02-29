import { useState, useEffect, useCallback } from "react";
import { EmployeeService } from "../../services/employeeServices";

export const useFetchEmployeesByModuleAndCompany = (module_id, company_id, reloadTrigger) => {
    const [employeesData, setEmployeesData] = useState({
        employees: [],
        totalEmployees: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEmployeesByModuleAndCompany = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await EmployeeService.getEmployeesByModuleAndCompany(module_id, company_id);
            setEmployeesData({ employees: data, totalEmployees: data.length });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [module_id, company_id]);

    useEffect(() => {
        fetchEmployeesByModuleAndCompany();
    }, [fetchEmployeesByModuleAndCompany, reloadTrigger]);

    return { employeesData, loading, error };
};

export default useFetchEmployeesByModuleAndCompany;
