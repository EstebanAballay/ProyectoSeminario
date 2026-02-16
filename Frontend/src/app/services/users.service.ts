import { Injectable } from '@angular/core';
import axiosService from '../../api/axiosClient';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private authUrl = 'http://localhost:3007/auth';
  private usersUrl = 'http://localhost:3003/users';

  async register(userData: any) {
    try {
      const response = await axiosService.post(`${this.usersUrl}/register`, userData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    console.log('intentando loguear');
    try {
      const response = await axiosService.post(`${this.authUrl}/login`, { email, password });
        console.log('respuesta backend:', response.data);
      // guardar token en localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
  async getMe() {
  const token = localStorage.getItem('token');
  console.log('TOKEN ENVIADO:', token);
  if (!token) {
    throw new Error('No hay token');
  }

  const response = await axiosService.get('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}
}

