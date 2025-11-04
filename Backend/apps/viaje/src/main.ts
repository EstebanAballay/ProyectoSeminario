import { NestFactory } from '@nestjs/core';
import { ViajeService } from './viaje.service';
import {AppModule} from '../app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200', // Debo permitir las peticions del front que corre en el 4200
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  const usersService = app.get(ViajeService);
  await usersService.testConnection();
  await app.listen(process.env.PORT || 3004);
}
bootstrap();