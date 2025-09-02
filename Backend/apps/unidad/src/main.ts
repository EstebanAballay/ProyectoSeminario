import { NestFactory } from '@nestjs/core';
import { UnidadModule } from './unidad.module';

async function bootstrap() {
  const app = await NestFactory.create(UnidadModule);
  await app.listen(3002); // este microservicio escucha en 3001
}
bootstrap();