import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ViajeModule } from './viaje/viaje.module';
import { UsuariosModule } from './users/users.module';

@Module({
  imports: [UsuariosModule,ViajeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
