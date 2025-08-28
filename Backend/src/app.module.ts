import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ViajeModule } from './viaje/viaje.module';

@Module({
  imports: [ViajeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
