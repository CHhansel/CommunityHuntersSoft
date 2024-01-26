import { useState } from 'react';
import { EmployeeService } from '../../services/employeeServices';

export const useUpdateEmployee = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateEmployee = async (employeeId, employeeData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await EmployeeService.updateEmployee(employeeId, employeeData);
            return response;  
        } catch (err) {
            setError(err.message);
            throw err; // Lanzamos el error para que pueda ser capturado por quien llama la función.
        } finally {
            setLoading(false);
        }
    };

    return { updateEmployee, isLoading, error };
};

export default useUpdateEmployee;
