import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule, {
    cors: true, // habilitar CORS si el frontend lo va a usar
  });

  app.setGlobalPrefix('auth'); // opcional, pero recomendado

  await app.listen(3005);
  console.log('Auth service running on port 3005');
}

bootstrap();
