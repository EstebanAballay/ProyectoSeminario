import { NestFactory } from '@nestjs/core';
import { MercadoPagoModule } from './mercadopago.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); 
  const app = await NestFactory.create(MercadoPagoModule);
  app.enableCors();
  await app.listen(process.env.PORT || 3002);
}
bootstrap();
