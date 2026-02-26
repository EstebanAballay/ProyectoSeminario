import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer'; // Importación necesaria
import { ViajeModule } from './viaje.module';

@Module({
  imports: [
    // 1. Configuración Global de Variables de Entorno
    ConfigModule.forRoot({ isGlobal: true }),

    // 2. Configuración de Base de Datos (Supabase)
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),


    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT), // Forzamos número (587)
        secure: false, // true para 465, false para 587 (TLS)
        auth: {
          user: process.env.MAIL_USER,      // "reportes.grafo@gmail.com"
          pass: process.env.MAIL_PASS,  // "zwlnrfjluzysohry"
        },
      },
      defaults: {
        from: '"Transporte Grafo" <reportes.grafo@gmail.com>',
      },
    }),

    ViajeModule,
  ],
})
export class AppModule {}