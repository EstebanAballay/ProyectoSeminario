import { Module } from '@nestjs/common';
import { CobroController } from './cobro.controller';
import { CobroService } from './cobro.service';

@Module({
  controllers: [CobroController],
  providers: [CobroService]
})
export class CobroModule {}
