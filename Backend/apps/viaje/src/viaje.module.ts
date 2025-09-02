import { Module } from '@nestjs/common';
import { ViajeService } from './viaje.service';
import { ViajeController } from './viaje.controller';

@Module({
  controllers: [ViajeController],
  providers: [ViajeService],
})
export class ViajeModule {}
