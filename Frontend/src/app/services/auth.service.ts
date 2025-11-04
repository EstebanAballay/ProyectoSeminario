import { Injectable } from '@angular/core';
import * as jwtDecode from 'jwt-decode';

interface TokenData {
  id: number;
  nombre: string;
  rol: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
    const decoded: TokenData = (jwtDecode as any).default(token);
      return decoded.rol;
    } catch (e) {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
