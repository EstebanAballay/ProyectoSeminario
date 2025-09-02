import { NestFactory } from '@nestjs/core';
import { UsuariosModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.create(UsuariosModule);
  await app.listen(3003); // este microservicio escucha en 3001
}
bootstrap();