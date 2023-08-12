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

// Interceptor de Respuesta para Manejar Errores Globales
// gpiAPI.interceptors.response.use(
//     response => response,
//     error => {
//         if (error.response && error.response.status === 401) {
//            // window.location.href = '/user/login'; // Redirige al usuario a la página de inicio de sesión
//         }

//         return Promise.reject(error);
//     }
// );

export default gpiAPI;

