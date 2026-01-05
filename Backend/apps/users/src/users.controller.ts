import { Controller, Post, Body} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  @Post('register')
  async registrar(@Body() dto: CreateUserDto) {
    return this.usersService.crearUsuario(dto);
}


  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.usersService.login(dto);
  }
}
