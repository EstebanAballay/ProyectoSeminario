import { NestFactory } from '@nestjs/core';
import { UsersService } from './users.service';
import {AppModule} from '../app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  const usersService = app.get(UsersService);


  await app.listen(process.env.PORT || 3003);
  console.log(`Servidor corriendo en puerto ${process.env.PORT || 3003}`);
}
bootstrap();
