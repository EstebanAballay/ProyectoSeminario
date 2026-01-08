// src/api/axiosClient.ts
import axios from 'axios';
import { config } from '../app/config/env';


const axiosService = axios.create({
  baseURL: 'http://localhost:3005',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosService.interceptors.request.use((requestConfig) => {
  const token = localStorage.getItem('token');

  if (token && !requestConfig.url?.includes('/auth/login')) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }

  return requestConfig;
});

export default axiosService;