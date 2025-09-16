import { NestFactory } from '@nestjs/core';
import { ViajeModule } from './viaje.module';

async function bootstrap() {
  const app = await NestFactory.create(ViajeModule);
  await app.listen(3004); // este microservicio escucha en 3004
}
bootstrap();