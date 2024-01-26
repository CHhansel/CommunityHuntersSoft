// hooks/useFetchCustomers.js
import { useState, useEffect, useCallback } from "react";
import { CustomerService } from "../../services/customerServices";

export const useFetchCustomers = (companyId, page, itemsPerPage, reloadTrigger) => {
    const [customersData, setCustomersData] = useState({
        customers: [],
        totalCustomers: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await CustomerService.getCustomers(companyId, page, itemsPerPage);
            setCustomersData({ customers: data.customers, totalCustomers: data.totalCustomers });
        } catch (err) {
            setError(err);
            throw err; // Lanzamos el error para que pueda ser capturado por quien llama la función.
        } finally {
            setLoading(false);
        }
    }, [companyId, page, itemsPerPage]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers, reloadTrigger]);

    return { customersData, loading, error };
};

