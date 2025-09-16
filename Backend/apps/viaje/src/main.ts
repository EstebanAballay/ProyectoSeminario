import { NestFactory } from '@nestjs/core';
import { ViajeService } from './viaje.service';
import {ViajeModule} from './viaje.module';

async function bootstrap() {
  const app = await NestFactory.create(ViajeModule);
  const usersService = app.get(ViajeService);
  await usersService.testConnection();
  await app.listen(process.env.PORT || 3004);
}
bootstrap();