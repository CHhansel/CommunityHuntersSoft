import { useState, useEffect, useCallback } from "react";
import { EmployeeService } from "../../services/employeeServices";

export const useFetchEmployees = (companyId, page, itemsPerPage, reloadTrigger) => {
    const [employeesData, setEmployeesData] = useState({
        employees: [],
        totalEmployees: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await EmployeeService.getEmployeesByCompanyId(companyId, page, itemsPerPage);
            setEmployeesData({ employees: data.employees, totalEmployees: data.totalEmployees });
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [companyId, page, itemsPerPage]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees, reloadTrigger]);

    return { employeesData, loading, error };
};

export default useFetchEmployees;
