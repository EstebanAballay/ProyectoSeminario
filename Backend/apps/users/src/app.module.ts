// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './users.module';
import { User } from './entities/user.entity';

@Module({
  imports: [
    // Variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Conexión a la base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASS', 'postgres'),
        database: config.get<string>('DB_NAME', 'usersdb'),
        entities: [User],
        synchronize: true,
      }),
    }),

    // Módulos del microservicio
    UsuariosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
