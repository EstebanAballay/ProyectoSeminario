import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.usersService.crearUsuario(createUserDto);
    }

    @Post('login')
    async login(@Body() dto: LoginDto) { 
    return this.usersService.login(dto);
}
}
