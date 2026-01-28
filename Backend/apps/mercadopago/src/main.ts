import { NestFactory } from '@nestjs/core';
import { MercadoPagoModule } from './mercadopago.module';

async function bootstrap() {
  const app = await NestFactory.create(MercadoPagoModule);
  app.enableCors();
  await app.listen(3005);
}

bootstrap();
