import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CobroModule } from './src/cobro.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  autoLoadEntities: true,
<<<<<<< HEAD
  synchronize: false,
=======
  synchronize: true,
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
  logging: true,
  ssl: {
    rejectUnauthorized: false,
  },
}),
    CobroModule,
  ],
})
export class AppModule {}