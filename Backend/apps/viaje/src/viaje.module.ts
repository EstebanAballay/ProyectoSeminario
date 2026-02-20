import { Module } from '@nestjs/common';
import { ViajeService } from './viaje.service';
import { ViajeController } from './viaje.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoViaje } from './entities/estadoViaje.entity';
import { Viaje } from './entities/viaje.entity';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../viajeAuth/auth.guard';
import { MailerModule } from '@nestjs-modules/mailer'; 
import { MailService } from './mail.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'no utilizar en producción',
      signOptions: { expiresIn: '24h' },
    }),
    TypeOrmModule.forFeature([Viaje, EstadoViaje]),
    HttpModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'reportes.grafo@gmail.com',
          pass: 'byzt tpep lwoe hnxg',
        },
      },
      defaults: {
        from: '"Grafo Logística" <noreply@grafologistica.com>',
      },
    }),
  ],
  controllers: [ViajeController],
  providers: [
    ViajeService,
    AuthGuard,
    MailService, // 👈 CLAVE
  ],
})
export class ViajeModule {}