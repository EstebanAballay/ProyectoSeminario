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
  async getPerfil() {
    console.log('getPerfil de service front iniciado');
    try {
      const response = await axiosService.get(`${this.usersUrl}/perfil`);
      console.log('Respuesta del perfil:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener perfil:', error.response?.data || error.message);
      throw error;
    }
  }

  async actualizarPerfil(userData: any) {
    try {
      const response = await axiosService.put(`${this.usersUrl}/perfil`, userData);
      return response.data;
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error.response?.data || error.message);
      throw error;
    }
  }
}

