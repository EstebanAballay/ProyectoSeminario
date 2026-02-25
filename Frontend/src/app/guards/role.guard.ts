// Este role guard se encarga de proteger las rutas en si, es decir, si yo quiero acceder desde el navegador a la ruta
// no me va a dejar porque o no tengo el rol o no tengo token directamente.
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

interface TokenPayload {
  role?: string;
  rol?: string;
  exp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  private decodeToken(token: string): TokenPayload | null {
    try {
      return JSON.parse(atob(token.split('.')[1])) as TokenPayload;
    } catch {
      return null;
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('No hay token, redirigiendo al login');
      this.router.navigate(['/login']);
      return false;
    }

    const payload = this.decodeToken(token);

    if (!payload) {
      console.error('Token inválido, redirigiendo al login');
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      return false;
    }

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.warn('Token expirado, redirigiendo al login');
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = payload.role ?? payload.rol;
    const requiredRole = route.data['role'];

    if (!requiredRole) {
      return true;
    }

    if (Array.isArray(requiredRole)) {
      if (requiredRole.includes(userRole)) {
        return true;
      }
    } else if (userRole === requiredRole) {
      return true;
    }

    console.warn('Acceso denegado, rol incorrecto');
    this.router.navigate(['/menu']);
    return false;
  }
}
