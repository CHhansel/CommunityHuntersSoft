import { useState, useEffect, useCallback } from "react";
import { ProductService } from "../../services/productServices";

export const useFetchProductsByCompanyId = (company_id, page, itemsPerPage, reloadTrigger) => {
    const [productsData, setProductsData] = useState({
        products: [],
        totalProducts: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ProductService.getProductsByCompanyId(company_id, page, itemsPerPage);
            setProductsData({ products: data.products, totalProducts: data.totalProducts });
        } catch (err) {
            setError(err);
            throw err; // Lanzamos el error para que pueda ser capturado por quien llama la función.
        } finally {
            setLoading(false);
        }
    }, [company_id, page, itemsPerPage]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts, reloadTrigger, company_id, page, itemsPerPage]);

    return { productsData, loading, error, fetchProducts };
};
