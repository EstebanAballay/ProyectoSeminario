import { Injectable } from '@angular/core';
import axiosService from '../../api/axiosClient';
import { config } from '../config/env';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private authUrl = 'http://localhost:3007/auth';
  private usersUrl = 'http://localhost:3003/users';
  private unidadUrl = 'http://localhost:3002/unidad';

  async register(userData: any) {
    try {
      const response = await axiosService.post(`${this.usersUrl}/register`, userData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async login(email: string, password: string) {
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

  async getListadoBasicoUsuarios() {
    try {
      const response = await axiosService.get(`${this.usersUrl}/listado-basico`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async actualizarRolUsuario(userId: number, role: string) {
    try {
      const response = await axiosService.patch(`${this.usersUrl}/${userId}/role`, { role });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async getListadoGestionClientes() {
    try {
      const response = await axiosService.get(`${this.usersUrl}/gestion-clientes`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async actualizarEstadoUsuario(userId: number, estado: 'activo' | 'eliminado') {
    try {
      const response = await axiosService.patch(`${this.usersUrl}/${userId}/estado`, { estado });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async crearTransportistaDesdeUsuario(data: {
    idUsuario: number;
    legajo: string;
    estadoTransportista: string;
  }) {
    try {
      const response = await axiosService.post(`${this.unidadUrl}/transportistas`, data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
}

