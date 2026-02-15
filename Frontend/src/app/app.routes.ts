import { Routes } from '@angular/router';
// Update the path below to the correct location of login.component.ts
import { LoginComponent } from './login.component/login.component';
import { RegisterComponent } from './register.component/register.component'; 
import { PaginainicioComponent } from './paginainicio/paginainicio.component';  
import { MenuComponent } from './menu.component/menu.component';  
import { NuevoViajeComponent } from './nuevo-viaje.component/nuevo-viaje.component';
import { MisViajesComponent } from './mis-viajes.component/mis-viajes.component';
import { PagoSeniaComponent } from './pago-senia.component/pago-senia.component';
import { Path } from 'leaflet';
import { AdminPanel } from './admin-panel/admin-panel.component'; 
import { RoleGuard } from './guards/role.guard';
import { ConsultarViajes } from './consultar-viajes-admin/consultar-viajes.component';
import { MenuCamioneroComponent } from './menu-camionero/menucamionero.component';
import {AbmUnidadesComponent} from './abm-unidades.component/abm-unidades.component'

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
  { path: 'admin', component: AdminPanel, canActivate: [RoleGuard], data: { role: 'admin' }}, 
  { path: 'admin/consultar-viajes', component: ConsultarViajes, canActivate: [RoleGuard], data: { role: 'admin' }},
  { path: 'admin/unidades',component:AbmUnidadesComponent},
  { path: 'menucamionero', component: MenuCamioneroComponent },

      //{ path: 'agregar-empleados', component: RegistroEmpleadosComponent },
      //{ path: 'gestion-clientes', component: GestionClientesComponent },
      // ... el resto de tus sub-componentes
];
