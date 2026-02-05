import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';
import { config } from '../app/config/env';

const axiosService = axios.create({
  baseURL: config.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token automáticamente
axiosService.interceptors.request.use(
  (requestConfig: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    // Verificamos que existan headers antes de asignar
    if (token && requestConfig.headers) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    
    return requestConfig;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default axiosService;