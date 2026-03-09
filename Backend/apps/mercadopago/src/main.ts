import { NestFactory } from '@nestjs/core';
import { MercadoPagoModule } from './mercadopago.module';

async function bootstrap() {
  const app = await NestFactory.create(MercadoPagoModule);
  app.enableCors();
  await app.listen(process.env.PORT || 3005);
}

bootstrap();
