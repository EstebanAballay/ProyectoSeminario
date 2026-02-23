import { NestFactory } from '@nestjs/core';
import { UsersService } from './users.service';
import {AppModule} from '../app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
<<<<<<< HEAD
    origin: ['http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
=======
    origin: 'http://localhost:4200',
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
    credentials: true,
  });

  const usersService = app.get(UsersService);


<<<<<<< HEAD
 await app.listen(3003, '0.0.0.0');
=======
  await app.listen(process.env.PORT || 3003);
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
  console.log(`Servidor corriendo en puerto ${process.env.PORT || 3003}`);
}
bootstrap();
