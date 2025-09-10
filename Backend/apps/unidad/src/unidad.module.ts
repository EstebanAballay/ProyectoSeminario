import { Module } from '@nestjs/common';
import { UnidadService } from './unidad.service';
import { UnidadController } from './unidad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unidad } from './entities/unidad.entity';
import { Camion } from './entities/camion.entity';
import { Acoplado } from './entities/acoplado.entity';
import { Semirremolque } from './entities/semirremolque.entity';
import { EstadoCamion } from './entities/estadoCamion.entity';
import { EstadoAcoplado } from './entities/estadoAcoplado.entity';
import { EstadoSemirremolque } from './entities/estadoSemirremolque.entity';
import { Transportista } from './entities/transportista.entity';
import { estadoTransportista } from './entities/estadoTransportista.entity';
import { Tipo } from './entities/tipo.entity';
import { TipoCamion } from './entities/tipoCamion.entity';
import { Especializacion } from './entities/especializacion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Unidad,
      Camion,
      Acoplado,
      Semirremolque,
      EstadoCamion,
      EstadoAcoplado,
      EstadoSemirremolque,
      Transportista,
      estadoTransportista,
      Tipo,
      TipoCamion,
      Especializacion,
    ]),
  ],
  controllers: [UnidadController],
  providers: [UnidadService],
})
export class UnidadModule {}
