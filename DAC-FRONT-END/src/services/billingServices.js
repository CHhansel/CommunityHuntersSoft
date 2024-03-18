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
            // Crear una instancia de Axios con un tiempo de espera
            const axiosInstance = axios.create({
                timeout: 2000, // 2000 milisegundos = 2 segundos
            });
    
            const response = await axiosInstance.get(`https://api.hacienda.go.cr/fe/ae?identificacion=${identification}`);
            return response.data; // Devuelve los datos de la respuesta
        } catch (error) {
            // Verificar si el error es debido a un timeout
            if (error.code === 'ECONNABORTED') {
                console.error(`La solicitud a Hacienda para la identificación ${identification} ha excedido el tiempo de espera.`);
                return {
                    status: 'error',
                    message: 'La solicitud ha excedido el tiempo de espera. La API de Hacienda puede estar caída o muy lenta.',
                };
            } else {
                // Manejo de otros tipos de errores
                console.error(`Error al obtener datos de Hacienda para identificación ${identification}`, error);
                throw error; // Lanza el error para manejarlo más adelante
            }
        }
    }
    
};
export const invoiceService = {
    createInvoice: async (token, invoiceData) => {
        try {
            const response = await DAC_API.post('atv/create-invoice/', invoiceData, {
                headers: { 'Authorization': token },
                responseType: 'blob' // Indica que esperamos un archivo como respuesta
            });

            // Crea un nuevo objeto Blob con los datos y lo retorna
            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

            // Si necesitas una URL para mostrar el PDF en el navegador
            const pdfUrl = window.URL.createObjectURL(pdfBlob);

            // Retorna un objeto con el blob y la URL para uso posterior
            return { pdfBlob, pdfUrl };
        } catch (error) {
            console.error(`Error al crear la factura: `, error);
            throw error; // Lanza el error para manejarlo más adelante
        }
    }
};