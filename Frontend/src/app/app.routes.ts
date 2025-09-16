import { Routes } from '@angular/router';
import { PaginainicioComponent } from './paginainicio/paginainicio.component';
import { RegisterComponent } from './register.component/register.component';
import { LoginComponent } from './login.component/login.component';
import { NuevoViajeComponent } from './nuevo-viaje.component/nuevo-viaje.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'paginainicio', component: PaginainicioComponent },
  { path: 'nuevoviaje', component: NuevoViajeComponent }
];
