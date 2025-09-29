import { NestFactory } from '@nestjs/core';
import { ViajeService } from './viaje.service';
import {AppModule} from '../app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const usersService = app.get(ViajeService);
  await usersService.testConnection();
  await app.listen(process.env.PORT || 3004);
}
bootstrap();