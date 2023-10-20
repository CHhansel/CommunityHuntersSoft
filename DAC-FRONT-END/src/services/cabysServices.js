import DAC_API from '../api/db-connection'; // Asegúrate de usar la ruta correcta

export const CabysService = {
    // Buscar productos en CABYS por término
    searchCabys: async (term) => {
        try {
            const response = await DAC_API.get(`/cabys/search`, { params: { term } });
            return response.data.cabys;
        } catch (error) {
            console.error('Error al buscar en CABYS:', error);
            throw error;
        }
    },

    // Obtener todas las 'cat1desc' únicas
    getAllCat1Desc: async () => {
        try {
            const response = await DAC_API.get(`/cabys/categories`);
            return response.data.categories;
        } catch (error) {
            console.error('Error al obtener categorías de CABYS:', error);
            throw error;
        }
    },

    // Obtener todas las 'cat2desc' únicas basadas en un valor 'cat1' proporcionado
    getCat2DescByCat1: async (cat1) => {
        try {
            const response = await DAC_API.get(`/cabys/subcategories1/${cat1}`);
            return response.data.subcategories;
        } catch (error) {
            console.error('Error al obtener subcategorías de CABYS:', error);
            throw error;
        }
    },
};
