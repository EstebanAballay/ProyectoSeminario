import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
    providers: [provideRouter(routes)],
<<<<<<< HEAD
}).catch((err) => console.error(err));
=======
});
>>>>>>> f842727340d87a0ac1975f5099436339cfabbdf9
