import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CobroController } from './cobro.controller';
import { CobroService } from './cobro.service';
import { Cobro } from './Entities/cobro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cobro])],
  controllers: [CobroController],
  providers: [CobroService]
})
export class CobroModule {}
