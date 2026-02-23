<<<<<<< HEAD
import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';
import { config } from '../app/config/env';

const axiosService = axios.create({
=======
// src/api/axiosClient.ts
import axios from 'axios';
import { config } from '../app/config/env';

const axiosService = axios.create({
  baseURL: config.baseUrl,
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
  headers: {
    'Content-Type': 'application/json',
  },
});

<<<<<<< HEAD
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
=======
// esta aprte agrega el token automaticamente
axiosService.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => {
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
    return Promise.reject(error);
  }
);

export default axiosService;