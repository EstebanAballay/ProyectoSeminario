import { Injectable } from '@angular/core';
import axiosService from '../../api/axiosClient';
import usersAxios from '../../api/usersAxios';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersUrl = '/users';
  private authUrl = '/auth';


  register(userData: any) {
        console.log('register de users.service llamado');
    return usersAxios.post('/users/register', userData);
  }

async login(email: string, password: string) {
  console.log('intentando loguear por AUTH');
  try {
    const response = await axiosService.post(`${this.authUrl}/login`, { email, password });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data;
  } catch (error: any) {
    throw error;
  }
}
}

