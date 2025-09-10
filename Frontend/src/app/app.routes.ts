import { Routes } from '@angular/router';
import { LoginComponent } from './login.component/login.component';
import { PaginainicioComponent } from './paginainicio/paginainicio.component';

export const routes: Routes = [
  { path: '', redirectTo: 'paginainicio', pathMatch: 'full' }, // ← cambio aquí
  { path: 'login', component: LoginComponent },
  { path: 'paginainicio', component: PaginainicioComponent },
  { path: '**', redirectTo: 'paginainicio' } // opcional: redirigir rutas inválidas al inicio
];
