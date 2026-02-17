import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { routes } from './app.routes'
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './login.component/login.component'; 
import { RegisterComponent } from './register.component/register.component'; 
import { PaginainicioComponent } from './paginainicio/paginainicio.component';
import { MenuComponent } from './menu.component/menu.component';
import { NuevoViajeComponent } from './nuevo-viaje.component/nuevo-viaje.component';
import { MisViajesComponent } from './mis-viajes.component/mis-viajes.component';
import { PagoSeniaComponent } from './pago-senia.component/pago-senia.component';
import { AdminPanel } from './admin-panel/admin-panel.component';
import { ConsultarViajes } from './consultar-viajes-admin/consultar-viajes.component';

@NgModule({
     
 imports: [
 BrowserModule,
 FormsModule,
 CommonModule,
 HttpClientModule,

 LoginComponent, 
 RegisterComponent, 
 PaginainicioComponent,
 MenuComponent,
 NuevoViajeComponent,
 MisViajesComponent,
 PagoSeniaComponent,
 AdminPanel,
 ConsultarViajes,
 
 RouterModule.forRoot(routes)
],

providers: [],
})

export class AppModule { }
