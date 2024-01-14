// hooks/useFetchCustomers.js
import { useState, useEffect } from 'react';
import { CustomerService } from '../../services/customerServices';

export const useFetchCustomers = (companyId, page, itemsPerPage) => {
    const [customers, setCustomers] = useState([]);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            try {
                const data = await CustomerService.getCustomers(companyId, page, itemsPerPage);
                setCustomers(data.customers);
                setTotalCustomers(data.totalCustomers);
            } catch (err) {
                console.error('Error al obtener los clientes:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [ companyId, page, itemsPerPage]);

    return { customers, totalCustomers, loading, error };
};
