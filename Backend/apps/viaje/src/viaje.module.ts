import { Module } from '@nestjs/common';
import { ViajeService } from './viaje.service';
import { ViajeController } from './viaje.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Viaje } from './entities/viaje.entity';
import { EstadoViaje } from './entities/estadoViaje.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Viaje,
    EstadoViaje
  ])],
  controllers: [ViajeController],
  providers: [ViajeService],
})
export class ViajeModule {}
