import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('No hay token, redirigiendo al login');
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRole = payload.role;
      const requiredRole = route.data['role'];

      console.log('RoleGuard → rol del usuario:', userRole, '| rol requerido:', requiredRole);

      if (userRole === requiredRole) {
        return true;
      } else {
        console.warn('Acceso denegado, rol incorrecto');
        // Redirige según el rol que tenga
        if (userRole === 'admin') this.router.navigate(['/misviajes']);
        else if (userRole === 'client') this.router.navigate(['/menu']);
        else this.router.navigate(['/login']);
        return false;
      }
    } catch (err) {
      console.error('Error al decodificar token:', err);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
