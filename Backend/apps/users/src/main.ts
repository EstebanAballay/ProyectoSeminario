import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Users-Microservice');
  const app = await NestFactory.create(AppModule);

  // CORS TOTAL: No rebota nada, ideal para desarrollo
  app.enableCors({
    origin: true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Validaciones globales para evitar datos basura
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT_USERS || 3003;
  await app.listen(port);
  
  logger.log(`🚀 Microservicio de Usuarios listo en: http://localhost:${port}`);
}
bootstrap();