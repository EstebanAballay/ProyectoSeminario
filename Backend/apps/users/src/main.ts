import { NestFactory } from '@nestjs/core';
import { UsersService } from './users.service';
import {AppModule} from '../app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const usersService = app.get(UsersService);
  await usersService.testConnection();
  await app.listen(process.env.PORT || 3003);
}
bootstrap();