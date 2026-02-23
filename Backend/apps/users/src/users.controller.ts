<<<<<<< HEAD
import { Controller, Post, Body, Get, Query, ParseArrayPipe} from '@nestjs/common';
=======
import { Controller, Post, Body} from '@nestjs/common';
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
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
<<<<<<< HEAD
    console.log("DTO recibido en el controlador:", dto);
    return this.usersService.login(dto);
  }

  @Get('by-ids')
  async getUsersByIds(
    // Este Pipe hace la magia: convierte "1,2,3" en [1, 2, 3]
    @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' })) 
    ids: number[], 
  ) {
    return this.usersService.findByIds(ids);
  }
=======
    return this.usersService.login(dto);
  }
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
}
