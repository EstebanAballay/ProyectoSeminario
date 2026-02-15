import { Injectable } from '@angular/core';
import axiosService from '../../api/axiosClient';
import { config } from '../config/env';

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
    console.log('intentando loguear');
    console.log(this.apiUrl);
    try {
      const response = await axiosService.post(`${this.apiUrl}/login`, { email, password });
        console.log('respuesta backend:', response.data);
      // guardar token en localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
}

