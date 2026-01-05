import { NestFactory } from '@nestjs/core';

import { UnidadService } from './unidad.service';
import {AppModule} from '../app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200', // Debo permitir las peticions del front que corre en el 4200
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const unidadService = app.get(UnidadService);
  await unidadService.testConnection();
  await app.listen(process.env.PORT || 3002);
}
bootstrap();