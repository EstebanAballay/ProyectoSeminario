import { NestFactory } from '@nestjs/core';
import { CobroModule } from './cobro.module';

async function bootstrap() {
  const app = await NestFactory.create(CobroModule);
  await app.listen(3001); // este microservicio escucha en 3001
}
bootstrap();