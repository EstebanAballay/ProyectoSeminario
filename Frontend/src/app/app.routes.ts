import { Routes } from '@angular/router';
import { LoginComponent } from './login.component/login.component';
import { PaginainicioComponent } from './paginainicio/paginainicio.component';
import { MenuComponent } from './menu.component/menu.component'; // 👈 acá va la importación

export const routes: Routes = [
  { path: '', redirectTo: 'paginainicio', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent },
  { path: 'paginainicio', component: PaginainicioComponent },
  { path: 'menu', component: MenuComponent }, // 👈 nueva ruta
  { path: '**', redirectTo: 'paginainicio' } 
];
