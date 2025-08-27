import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CobroModule } from './cobro/cobro.module';

@Module({
  imports: [CobroModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
