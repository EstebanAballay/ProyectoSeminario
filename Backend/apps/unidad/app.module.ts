import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadModule } from './src/unidad.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  autoLoadEntities: true,
  synchronize: false,
  logging: true,
  ssl: false,
}),
    UnidadModule,
  ],
})
export class AppModule {}