import { NestFactory } from '@nestjs/core';
import { MapsModule } from './maps.module';

async function bootstrap() {
  const app = await NestFactory.create(MapsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
