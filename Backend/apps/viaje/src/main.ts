import { NestFactory } from '@nestjs/core';
import { ViajeService } from './viaje.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
<<<<<<< HEAD
    origin: 'http://localhost:4200', 
=======
    origin: true,
>>>>>>> f17be1eb8542d84056aa10a64a1e8fce0cee9cb7
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  const viajeService = app.get(ViajeService);
  
  try {
    await viajeService.testConnection();
  } catch (error) {
    console.error('Error iniciando la conexión de diagnóstico:', error);
  }

  // Usamos la variable de entorno del puerto que definiste en tu .env (PORT_VIAJE)
  const port = process.env.PORT_VIAJE || 3004;
  await app.listen(port);
  console.log(`🚀 Microservicio de Viajes corriendo en puerto: ${port}`);
}
bootstrap();