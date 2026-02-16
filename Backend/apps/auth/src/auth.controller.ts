import {
  Body,
  Controller,
  Get,
  HttpCode,
  Req,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./guard/auth.guard";
import { RolesGuard } from "./guard/roles.guard";
import { Role } from "./role.enum";
import { Auth } from "./decorators/auth.decorator";

interface RequestWithUser extends Request {
  user: { email: string; role: string };
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get("profile")
  @Auth(Role.CLIENT)
  @UseGuards(AuthGuard, RolesGuard)
  profile(@Req() req: RequestWithUser) {
    return req.user;
  }
}
