import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from "./constants/jwt.constant";
import { JwtModule } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret, // clave para firmar y verificar los tokens
      signOptions: { expiresIn: "1d" }, // tiempo de expiracion del token
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}