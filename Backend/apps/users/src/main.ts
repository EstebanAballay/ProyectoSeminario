// archivo que inicia el servidor de nest
import { NestFactory } from '@nestjs/core';
import { UsersService } from './users.service';
import {AppModule} from '../app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // crea e inicializa la app
  app.enableCors({ // permite que el front haga peiciones
    origin: 'http://localhost:4200', // solo acepta peticiones desde el frontend local
    credentials: true, //  permite enviar cookies o encabezados de autenticación
  });


  await app.listen(process.env.PORT || 3003); // si el puerto esta definido en el .env lo UserActivation, sino por defecto usa el 3003
  console.log(`Servidor corriendo en puerto ${process.env.PORT || 3003}`); 
}
bootstrap();
