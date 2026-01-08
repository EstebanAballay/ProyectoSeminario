import { Controller, Post, Body, Get, Param} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  @Get("by-email/:email")
  async findByEmail(@Param("email") email: string) {
    return await this.usersService.findOneByEmail(email);
  }

  // GET /users/by-email-password/:email
  @Get("by-email-password/:email")
  async findByEmailWithPassword(@Param("email") email: string) {
    return await this.usersService.findOneByEmailWithPassword(email);
  }
  @Post('register') // llamada al metodo de creacion de usuarios
  async registrar(@Body() dto: CreateUserDto) {
     console.log('🔥 CONTROLLER USERS REGISTER HIT');
  console.log('📥 DTO RECIBIDO:', dto);
    return this.usersService.crearUsuario(dto);
  
}



}
