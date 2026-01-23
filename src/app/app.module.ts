import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NuevoEmpleadoComponent } from './nuevo-empleado.component/nuevo-empleado.component';
import { LoginComponent } from './login.component/login.component'; 
import { RegisterComponent } from './register.component/register.component'; 
import { PaginainicioComponent } from './paginainicio/paginainicio.component';  
import { MenuComponent } from './menu.component/menu.component';   
import { NuevoViajeComponent } from './nuevo-viaje.component/nuevo-viaje.component';
import { MisViajesComponent } from './mis-viajes.component/mis-viajes.component';
import { PagoSeniaComponent } from './pago-senia.component/pago-senia.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    LoginComponent, 
    RegisterComponent, 
    PaginainicioComponent,
    MenuComponent,
    NuevoViajeComponent,
    MisViajesComponent,
    PagoSeniaComponent,
    NuevoEmpleadoComponent,
    RouterModule.forRoot([
      { path: 'nuevo-empleado', component: NuevoEmpleadoComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'paginainicio', component: PaginainicioComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'nuevoviaje', component: NuevoViajeComponent },
      { path: 'misviajes', component: MisViajesComponent },
      { path: 'pagosenia', component: PagoSeniaComponent },
      { path: '', redirectTo: 'paginainicio', pathMatch: 'full' },
      { path: '**', redirectTo: 'paginainicio' }
    ])
  ],
  providers: [],
  bootstrap: [/* Asegurate de tener tu AppComponent aquí */]
})
export class AppModule { }