<<<<<<< HEAD
=======

>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
<<<<<<< HEAD
import { routes } from './app.routes'
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
=======

>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d

import { LoginComponent } from './login.component/login.component'; 
import { RegisterComponent } from './register.component/register.component'; 
import { PaginainicioComponent } from './paginainicio/paginainicio.component';
import { MenuComponent } from './menu.component/menu.component';
import { NuevoViajeComponent } from './nuevo-viaje.component/nuevo-viaje.component';
import { MisViajesComponent } from './mis-viajes.component/mis-viajes.component';
import { PagoSeniaComponent } from './pago-senia.component/pago-senia.component';
<<<<<<< HEAD
import { AdminPanel } from './admin-panel/admin-panel.component';
import { ConsultarViajes } from './consultar-viajes-admin/consultar-viajes.component';
=======

>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d

@NgModule({
     
 imports: [
 BrowserModule,
 FormsModule,
<<<<<<< HEAD
 CommonModule,
 HttpClientModule,

=======
 
 
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
 LoginComponent, 
 RegisterComponent, 
 PaginainicioComponent,
 MenuComponent,
 NuevoViajeComponent,
 MisViajesComponent,
 PagoSeniaComponent,
<<<<<<< HEAD
 AdminPanel,
 ConsultarViajes,
 
 RouterModule.forRoot(routes)
],

providers: [],
})

export class AppModule { }
=======

 
 RouterModule.forRoot([
{ path: '', redirectTo: 'paginainicio', pathMatch: 'full' },
{ path: 'login', component: LoginComponent },
{ path: 'register', component: RegisterComponent },
{ path: 'paginainicio', component: PaginainicioComponent },
{ path: 'menu', component: MenuComponent },
{ path: 'nuevoviaje', component: NuevoViajeComponent },
{ path: 'misviajes', component: MisViajesComponent },
{ path: 'pagosenia', component: PagoSeniaComponent },
{ path: '**', redirectTo: 'paginainicio', pathMatch: 'full' }
])
],
providers: [],
})

export class AppModule { }
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
