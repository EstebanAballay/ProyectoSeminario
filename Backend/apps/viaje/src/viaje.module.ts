import { Module } from '@nestjs/common';
import { ViajeService } from './viaje.service';
import { ViajeController } from './viaje.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoViaje } from './entities/estadoViaje.entity';
import { Viaje } from './entities/viaje.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Viaje,EstadoViaje]),HttpModule],
  controllers: [ViajeController],
  providers: [ViajeService],
})
export class ViajeModule {}