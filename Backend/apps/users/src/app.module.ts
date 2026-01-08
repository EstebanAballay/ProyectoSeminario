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
        host: config.get<string>('DB_HOST', 'localhost'), // direccion del servidor
        port: config.get<number>('DB_PORT', 5432), // direccion del puerto
        username: config.get<string>('DB_USER', 'postgres'), // usuario de bd
        password: config.get<string>('DB_PASS', 'postgres'), // contraseña de bd
        database: config.get<string>('DB_NAME', 'usersdb'), // db
        entities: [User], // entidades de las que crea tablas
        autoLoadEntities: true, 
        synchronize: true, // sincroniza automáticamente el esquema de la base con las entidades
      }),
    }),

    // Módulos del microservicio
    UsuariosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
