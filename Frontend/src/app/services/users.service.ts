import { Injectable } from '@angular/core';
import axiosService from '../../api/axiosClient';
<<<<<<< HEAD
import { config } from '../config/env';
=======
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d

@Injectable({
  providedIn: 'root'
})
export class UsersService {
<<<<<<< HEAD
  private apiUrl = `${config.services.user}/users`;
=======
  private apiUrl = '/users';
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d

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
<<<<<<< HEAD
    console.log(this.apiUrl);
=======
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
    try {
      const response = await axiosService.post(`${this.apiUrl}/login`, { email, password });
        console.log('respuesta backend:', response.data);
      // guardar token en localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
<<<<<<< HEAD
      
      console.log(response.data);
=======

>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
}

