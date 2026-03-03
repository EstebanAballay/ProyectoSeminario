import { Injectable } from '@angular/core';
import axiosService from '../../api/axiosClient';
import { config } from '../config/env';

const unidadApiUrl = `${config.services.unidad}/unidad`;

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${config.services.user}/users`;

  async register(userData: any) {
    try {
      const response = await axiosService.post(`${this.apiUrl}/register`, userData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      console.log(`${this.apiUrl}/login`)
      const response = await axiosService.post(`${this.apiUrl}/login`, { email, password });
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
      const response = await axiosService.get(`${this.apiUrl}/perfil`);
      console.log('Respuesta del perfil:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener perfil:', error.response?.data || error.message);
      throw error;
    }
  }

  async actualizarPerfil(userData: any) {
    try {
      const response = await axiosService.put(`${this.apiUrl}/perfil`, userData);
      return response.data;
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error.response?.data || error.message);
      throw error;
    }
  }

  async getListadoBasicoUsuarios() {
    try {
      const response = await axiosService.get(`${this.apiUrl}/listado-basico`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async actualizarRolUsuario(userId: number, role: string) {
    try {
      const response = await axiosService.patch(`${this.apiUrl}/${userId}/role`, { role });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async getListadoGestionClientes() {
    try {
      const response = await axiosService.get(`${this.apiUrl}/gestion-clientes`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async actualizarEstadoUsuario(userId: number, estado: 'activo' | 'eliminado') {
    try {
      const response = await axiosService.patch(`${this.apiUrl}/${userId}/estado`, { estado });
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
      const response = await axiosService.post(`${unidadApiUrl}/transportistas`, data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

}

