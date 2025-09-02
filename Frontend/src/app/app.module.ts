import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PaginainicioComponent } from './paginainicio/paginainicio.component';

@NgModule({
  imports: [
    BrowserModule,
    PaginainicioComponent  // 🔹 Importar, no declarar
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
