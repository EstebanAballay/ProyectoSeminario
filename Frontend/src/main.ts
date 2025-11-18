import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
    providers: [provideRouter(routes)],
<<<<<<< HEAD
}).catch((err) => console.error(err));
=======

}).catch((err) => console.error(err));

>>>>>>> fae564c3 (pantalla menucamionero a terminar)
