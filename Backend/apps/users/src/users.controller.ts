import { Controller, Post, Body, Get, UseGuards, Req, Put , Query, ParseArrayPipe} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from './guard/auth.guard';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
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

        @Put('perfil')
        @UseGuards(AuthGuard)
        async actualizarPerfil(@Req() req: any, @Body() dto: UpdatePerfilDto) {
            const email = req.user.email;
            return this.usersService.actualizarPerfil(email, dto);
        }
  @Get('by-ids')
  async getUsersByIds(
    // Este Pipe hace la magia: convierte "1,2,3" en [1, 2, 3]
    @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' })) 
    ids: number[], 
  ) {
    return this.usersService.findByIds(ids);
  }
}