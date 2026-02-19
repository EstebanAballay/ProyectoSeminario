import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from './guard/auth.guard';
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.usersService.crearUsuario(createUserDto);
    }

    @Get('perfil')
    @UseGuards(AuthGuard)
    async perfil(@Req() req: any) {
        console.log('perfil de controller de users back iniciado');
    const email = req.user.email;
    return this.usersService.perfil(email);
    }

}