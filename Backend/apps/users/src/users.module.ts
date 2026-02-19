import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: 'no utilizar en producción', // Mismo secreto que en auth service
    signOptions: { expiresIn: '1h' },
  }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsuariosModule {}
