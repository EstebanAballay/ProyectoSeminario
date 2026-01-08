import { Injectable } from '@angular/core';
import axiosService from '../../api/axiosClient';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
async login(email: string, password: string) {
  console.log('2️⃣ AuthApiService.login', email, password);
  const response = await axiosService.post('/auth/login', { email, password });
  if (response.data?.token) {
    localStorage.setItem('token', response.data.token);
  }
    console.log('3️⃣ Respuesta backend', response.data);
  return response.data;
}
}
