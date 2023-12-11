import DAC_API from '../api/db-connection';  // Asegúrate de usar la ruta correcta
import axios from 'axios';

// Función genérica para peticiones GET
const getFromApi = async (token, url) => {
    try {
        const response = await DAC_API.get(url, { 
            headers: { 'Authorization': token }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener datos de: ${url}`, error);
        throw error;
    }
};

export const paymentMethodsService = {
    getPaymentMethods: async (token) => {
        return await getFromApi(token, '/billing/get-all-payment-methods/');
    }
};

export const allSaleConditionService = {
    getSaleConditions: async (token) => {
        return await getFromApi(token, '/billing/get-all-sale-conditions/');
    }
};



export const haciendaService = {
    getDNIinfo: async (identification) => {
        try {
            const response = await axios.get(`https://api.hacienda.go.cr/fe/ae?identificacion=${identification}`);
            return response.data; // devuelve los datos de la respuesta
        } catch (error) {
            console.error(`Error al obtener datos de Hacienda para identificación ${identification}`, error);
            throw error; // Lanza el error para manejarlo más adelante
        }
    }
};