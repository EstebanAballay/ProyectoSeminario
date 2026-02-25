import { Routes } from '@angular/router';
import { PaginainicioComponent } from './paginainicio/paginainicio.component';  
import { MenuComponent } from './menu.component/menu.component';  
import { NuevoViajeComponent } from './nuevo-viaje.component/nuevo-viaje.component';
import { MisViajesComponent } from './mis-viajes.component/mis-viajes.component';
import { PagoSeniaComponent } from './pago-senia.component/pago-senia.component';
import { AdminPanel } from './admin-panel/admin-panel.component'; 

import { RoleGuard } from './guards/role.guard';
import { ConsultarViajes } from './consultar-viajes-admin/consultar-viajes.component';
import { MenucamioneroComponent } from './menu-camionero/menucamionero.component';
import { AbmUnidadesComponent } from './abm-unidades.component/abm-unidades.component'
import { ConsultarPagos } from './consultar-pagos/consultar-pagos';
import { PagosRealizadosComponent } from './pagos-realizados/pagos-realizados.component'

import { PerfilComponent } from './perfil.component/perfil.component';
import { AgregarEmpleadosComponent } from './agregar-empleados/agregar-empleados.component';
import { GestionClientesComponent } from './gestion-clientes/gestion-clientes.component';
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
  { path: 'paginainicio', component: PaginainicioComponent  },
  { path: 'menu', component: MenuComponent, canActivate: [RoleGuard], data: { role: 'client' } },
  { path: 'misviajes', component: MisViajesComponent, canActivate: [RoleGuard], data: { role: 'client' } }, 
  { path: 'nuevoviaje', component: NuevoViajeComponent, canActivate: [RoleGuard], data: { role: 'client' }  },
  { path: 'admin', component: AdminPanel, canActivate: [RoleGuard], data: { role: 'admin' }}, 
  { path: 'admin/consultar-viajes', component: ConsultarViajes, canActivate: [RoleGuard], data: { role: 'admin' }},
  { path: 'admin/agregar-empleados', component: AgregarEmpleadosComponent, canActivate: [RoleGuard], data: { role: 'admin' }},
  { path: 'admin/gestion-clientes', component: GestionClientesComponent, canActivate: [RoleGuard], data: { role: 'admin' }},
  { path: 'admin/unidades',component:AbmUnidadesComponent},
  { path: 'menucamionero', component: MenucamioneroComponent },
  { path: 'consultar-pagos', component: ConsultarPagos, canActivate: [RoleGuard], data: { role: 'client' } },
  { path: 'pagos-realizados', component: PagosRealizadosComponent, canActivate: [RoleGuard], data: { role: 'client' } },
  
      //{ path: 'agregar-empleados', component: RegistroEmpleadosComponent },
      //{ path: 'gestion-clientes', component: GestionClientesComponent },
      // ... el resto de tus sub-componentes
  { path: 'perfil', component: PerfilComponent, canActivate: [RoleGuard], data: { role: ['client', 'admin'] }}
];
