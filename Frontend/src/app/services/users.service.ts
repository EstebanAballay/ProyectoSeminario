import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:3003/users'; 

  async register(userData: any) {
    try {
      const response = await axios.post(`${this.apiUrl}/register`, userData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async login(email: string, password: string) {
  try {
    const response = await axios.post(`${this.apiUrl}/login`, { email, password }, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
}
}
