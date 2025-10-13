import { Controller, Post, Body} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('usuarios')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  @Post('registro')
  async registrar(@Body() dto: CreateUserDto) {
    return this.usersService.crearUsuario(dto);
  }
}
