import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // This will be proxied to http://localhost:8000 by Vite
});

export default api;