import { Module } from '@nestjs/common';
import { ViajeService } from './viaje.service';
import { ViajeController } from './viaje.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoViaje } from './entities/estadoViaje.entity';
import { Viaje } from './entities/viaje.entity';
import { HttpModule } from '@nestjs/axios';
<<<<<<< HEAD
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../viajeAuth/auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: 'no utilizar en producción', // DEBE ser la misma que en el microservicio Auth
      signOptions: { expiresIn: '24h' },
    }),
    TypeOrmModule.forFeature([Viaje,EstadoViaje]),HttpModule],
  controllers: [ViajeController],
  providers: [ViajeService,AuthGuard],
=======

@Module({
  imports: [TypeOrmModule.forFeature([Viaje,EstadoViaje]),HttpModule],
  controllers: [ViajeController],
  providers: [ViajeService],
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
})
export class ViajeModule {}