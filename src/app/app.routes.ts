import { Routes } from '@angular/router';

import { LoginComponent } from './login.component/login.component';
import { RegisterComponent } from './register.component/register.component';
import { PaginainicioComponent } from './paginainicio/paginainicio.component';
import { MenuComponent } from './menu.component/menu.component';
import { NuevoViajeComponent } from './nuevo-viaje.component/nuevo-viaje.component';
import { MisViajesComponent } from './mis-viajes.component/mis-viajes.component';
import { PagoSeniaComponent } from './pago-senia.component/pago-senia.component';
import { MenucamioneroComponent } from './menu.camionero/menucamionero.component';
import { NuevoEmpleadoComponent } from './nuevo-empleado.component/nuevo-empleado.component';

// 1. Importamos el nuevo componente de Unidades que creaste con la terminal
import { AbmUnidadesComponent } from './abm-unidades.component/abm-unidades.component';

import { ListaUnidadesComponent } from './componentes/lista-unidades/lista-unidades.component';
import { NuevaUnidadComponent } from './componentes/nueva-unidad/nueva-unidad.component';

export const routes: Routes = [
    // 2. Agregamos la ruta para gestionar camiones y remolques
    { path: 'abm-unidades', component: AbmUnidadesComponent },
    
    { path: 'nuevo-empleado', component: NuevoEmpleadoComponent },
    { path: '', redirectTo: 'paginainicio', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'paginainicio', component: PaginainicioComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'nuevoviaje', component: NuevoViajeComponent },
    { path: 'misviajes', component: MisViajesComponent },
    { path: 'pagosenia', component: PagoSeniaComponent },
    { path: 'menucamionero', component: MenucamioneroComponent },

<<<<<<< Updated upstream
    // El comodín siempre al final para evitar errores de navegación
    { path: '**', redirectTo: 'paginainicio', pathMatch: 'full' }
];
=======
  // EMPLEADOS
  { path: 'nuevo-empleado', component: NuevoEmpleadoComponent },
  { path: 'lista-empleados', component: ListaEmpleadosComponent },
  { path: 'editar-empleado/:id', component: NuevoEmpleadoComponent },

  // UNIDADES
  { path: 'nueva-unidad', component: NuevaUnidadComponent },
  { path: 'lista-unidades', component: ListaUnidadesComponent },
  { path: 'editar-unidad/:id', component: NuevaUnidadComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'paginainicio', component: PaginainicioComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'nuevoviaje', component: NuevoViajeComponent },
  { path: 'misviajes', component: MisViajesComponent },
  { path: 'pagosenia', component: PagoSeniaComponent },
  { path: 'menucamionero', component: MenucamioneroComponent },

  { path: '**', redirectTo: 'paginainicio' }
];
>>>>>>> Stashed changes
