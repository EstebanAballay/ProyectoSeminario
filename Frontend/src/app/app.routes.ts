import { Routes } from '@angular/router';
// Update the path below to the correct location of login.component.ts
import { LoginComponent } from './login.component/login.component';
import { RegisterComponent } from './register.component/register.component'; 
import { PaginainicioComponent } from './paginainicio/paginainicio.component';  
import { MenuComponent } from './menu.component/menu.component';  
import { NuevoViajeComponent } from './nuevo-viaje.component/nuevo-viaje.component';
import { MisViajesComponent } from './mis-viajes.component/mis-viajes.component';
<<<<<<< HEAD
import { PagoSeniaComponent } from './pago-senia.component/pago-senia.component';
import { Path } from 'leaflet';

=======
import { RoleGuard } from './guards/role.guard';
>>>>>>> f842727340d87a0ac1975f5099436339cfabbdf9
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
<<<<<<< HEAD
  { path: 'paginainicio', component: PaginainicioComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'nuevoviaje', component: NuevoViajeComponent },
  { path: 'misviajes', component: MisViajesComponent },
  { path: 'pagosenia', component: PagoSeniaComponent },
  { path: '**', redirectTo: '/pago-senia', pathMatch: 'full' }
=======
  { path: 'paginainicio', component: PaginainicioComponent, canActivate: [RoleGuard], data: { role: 'client' }  },
  { path: 'menu', component: MenuComponent, canActivate: [RoleGuard], data: { role: 'client' } },
  { path: 'misviajes', component: MisViajesComponent, canActivate: [RoleGuard], data: { role: 'client' } }, 
  { path: 'nuevoviaje', component: NuevoViajeComponent, canActivate: [RoleGuard], data: { role: 'client' }  },
>>>>>>> f842727340d87a0ac1975f5099436339cfabbdf9
];
