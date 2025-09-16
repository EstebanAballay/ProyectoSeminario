import { Routes } from '@angular/router';
import { PaginainicioComponent } from './paginainicio/paginainicio.component';

export const routes: Routes = [
  { path: '', redirectTo: 'paginainicio', pathMatch: 'full' }, // ← cambio aquí
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'paginainicio', component: PaginainicioComponent },
  { path: '**', redirectTo: 'paginainicio' } // opcional: redirigir rutas inválidas al inicio
];
