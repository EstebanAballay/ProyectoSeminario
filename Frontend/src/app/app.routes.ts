import { Routes } from '@angular/router';
import { PaginainicioComponent } from './paginainicio/paginainicio.component';  
import { MenuComponent } from './menu.component/menu.component';  
import { NuevoViajeComponent } from './nuevo-viaje.component/nuevo-viaje.component';
import { MisViajesComponent } from './mis-viajes.component/mis-viajes.component';

import { RoleGuard } from './guards/role.guard';
import { PerfilComponent } from './perfil.component/perfil.component';
export const routes: Routes = [
  { path: '', redirectTo: 'paginainicio', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./login.component/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register.component/register.component').then(m => m.RegisterComponent)
  },
  { path: 'paginainicio', component: PaginainicioComponent, canActivate: [RoleGuard], data: { role: 'client' }  },
  { path: 'menu', component: MenuComponent, canActivate: [RoleGuard], data: { role: 'client' } },
  { path: 'misviajes', component: MisViajesComponent, canActivate: [RoleGuard], data: { role: 'client' } }, 
  { path: 'nuevoviaje', component: NuevoViajeComponent, canActivate: [RoleGuard], data: { role: 'client' }  },
  { path: 'perfil', component: PerfilComponent, canActivate: [RoleGuard], data: {role: 'client'}}
];
