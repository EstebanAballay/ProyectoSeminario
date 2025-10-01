import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component/login.component';  // Asegúrate de que la ruta sea correcta

@NgModule({
    declarations: [
        // No declares standalone components here
    ],
    imports: [
        BrowserModule,
        FormsModule,
        LoginComponent, // Importa el componente standalone aquí
        RouterModule.forRoot([
        { path: '', component: LoginComponent },  // Configura las rutas aquí
        // Otras rutas pueden ir aquí
        ])
    ],
    providers: []
  // No es necesario el array `bootstrap` si usas bootstrapApplication
})
export class AppModule { }
