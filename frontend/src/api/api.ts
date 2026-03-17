import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/api',
});

// Este interceptor adjunta el token automáticamente a todas las peticiones
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;