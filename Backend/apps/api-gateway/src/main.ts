import { NestFactory } from '@nestjs/core';
import { AppModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Habilitamos CORS para que Angular pueda comunicarse con el Gateway
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://localhost:4200',
      process.env.FRONTEND_URL || 'https://proyecto-seminario-kgejynf00-estebanaballays-projects.vercel.app',
      /\.vercel\.app$/,  // Acepta CUALQUIER preview de Vercel (el hash cambia en cada deploy)
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Usamos PORT en mayúscula
  await app.listen(process.env.PORT ?? 3000);
  console.log(`API Gateway corriendo en http://localhost:3000`);
}
bootstrap();

