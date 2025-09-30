import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CobroController } from './cobro.controller';
import { CobroService } from './cobro.service';
import { Cobro } from './Entities/cobro.entity';
import { abonante } from './Entities/abonante.entity';
import { seña } from './Entities/seña.entity';
import { resto } from './Entities/resto.entity';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [TypeOrmModule.forFeature([Cobro,
    abonante,
    resto,
    seña
  ]),HttpModule],
  controllers: [CobroController],
  providers: [CobroService]
})
export class CobroModule {}
