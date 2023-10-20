import axios from 'axios';

const DAC_API = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// Interceptor de Solicitud para Adjuntar Token si Existe
DAC_API.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = {
            ...config.headers,
            'x-token': token,
        };
    }
    return config;
});

export default DAC_API;