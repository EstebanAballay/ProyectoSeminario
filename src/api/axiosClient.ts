// src/api/axiosClient.ts
import axios from 'axios';
import { config } from '../app/config/env';

const axiosService = axios.create({
  baseURL: config.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    return Promise.reject(error);
  }
);

export default axiosService;