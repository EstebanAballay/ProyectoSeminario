import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
  secret: 'TU_SECRETO_SUPER_SEGURO', // reemplazar por un env var
  signOptions: { expiresIn: '1d' },  // tiempo de expiración
    }),  
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsuariosModule {}
