import { useState } from 'react';
import EmployeeService from '../../services/employeeServices'; // Asegúrate de usar la ruta correcta

export const useCreateEmployee = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createEmployee = async (employeeData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await EmployeeService.createEmployee(employeeData);
            return response;  // Retorna la respuesta de la API
        } catch (err) {
            setError(err.message); // Establece el mensaje de error
            throw err; // Lanzamos el error para que pueda ser capturado por quien llama la función.
        } finally {
            setLoading(false); // Finaliza el estado de carga
        }
    };

    return { createEmployee, isLoading, error };
};
