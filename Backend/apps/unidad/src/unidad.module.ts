import { Module } from '@nestjs/common';
import { UnidadService } from './unidad.service';
import { UnidadController } from './unidad.controller';

@Module({
  controllers: [UnidadController],
  providers: [UnidadService],
})
export class UnidadModule {}
