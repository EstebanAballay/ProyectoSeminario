// app.routes.ts
import { Routes } from '@angular/router';

// (Aquí van tus importaciones de componentes existentes...)
import { LoginComponent } from './login.component/login.component';
import { RegisterComponent } from './register.component/register.component';
import { PaginainicioComponent } from './paginainicio/paginainicio.component';
import { MenuComponent } from './menu.component/menu.component';
import { NuevoViajeComponent } from './nuevo-viaje.component/nuevo-viaje.component';
import { MisViajesComponent } from './mis-viajes.component/mis-viajes.component';
import { PagoSeniaComponent } from './pago-senia.component/pago-senia.component';


import { MenucamioneroComponent } from './menu.camionero/menucamionero.component';

// ---
export const routes: Routes = [
    { path: '', redirectTo: 'paginainicio', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'paginainicio', component: PaginainicioComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'nuevoviaje', component: NuevoViajeComponent },
    { path: 'misviajes', component: MisViajesComponent },
    { path: 'pagosenia', component: PagoSeniaComponent },
    { path: 'menucamionero', component: MenucamioneroComponent },

    // La ruta catch-all (**) siempre debe ir al final
    { path: '**', redirectTo: 'paginainicio', pathMatch: 'full' }
];