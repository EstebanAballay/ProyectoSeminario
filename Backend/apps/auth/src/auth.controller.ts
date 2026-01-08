import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/register
  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    console.log('register de auth.controller llamado: ', registerDto);
    return await this.authService.register(registerDto);
  }

  // POST /auth/login
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
      console.log("🔥 CONTROLLER LOGIN HIT", loginDto);
    return await this.authService.login(loginDto);
  }
}
