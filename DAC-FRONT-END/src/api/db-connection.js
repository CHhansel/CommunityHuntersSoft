import axios from 'axios';

const gpiAPI = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// Interceptor de Solicitud para Adjuntar Token si Existe
gpiAPI.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = {
            ...config.headers,
            'x-token': token,
        };
    }
    return config;
});

export default gpiAPI;