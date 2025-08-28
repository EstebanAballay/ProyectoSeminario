import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ViajeModule } from './viaje/viaje.module';
import { UsuariosModule } from './users/users.module';
import { CobroModule } from './cobro/cobro.module';
import { UnidadModule } from './unidad/unidad.module';

@Module({
  imports: [CobroModule,ViajeModule,UsuariosModule,UnidadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
