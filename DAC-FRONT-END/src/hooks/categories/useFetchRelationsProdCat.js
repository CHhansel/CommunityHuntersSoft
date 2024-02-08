// hooks/useFetchRelationsProductCategory.js
import { useState, useEffect, useCallback } from "react";
import { CategoryService } from "../../services/categoryServices";

export const useFetchRelationsProductCategory = (company_id, reloadTrigger) => {
    const [relationsData, setRelationsData] = useState({
        relations: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRelations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await CategoryService.getRelationsByCompanyId(company_id);
            setRelationsData({ relations: data.relations });
        } catch (err) {
            setError(err);
            throw err; // Lanzamos el error para que pueda ser capturado por quien llama la función.
        } finally {
            setLoading(false);
        }
    }, [company_id]);

    useEffect(() => {
        fetchRelations();
    }, [fetchRelations, reloadTrigger]);

    return { relationsData, loading, error };
};
