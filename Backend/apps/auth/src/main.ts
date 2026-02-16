import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: ['http://localhost:4200', 'https://localhost:4200'],
    credentials: true,
  });

  const port = process.env.PORT || 3007;
  await app.listen(port);
  console.log(`Auth microservicio corriendo en puerto ${port}`);
}

bootstrap();
