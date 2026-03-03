import { Controller, Post, Body, Get, Query, Patch, Param, Put, Req, Headers, ParseArrayPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.usersService.crearUsuario(createUserDto);
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.usersService.login(dto);
    }

    @Get('by-ids')
    async getUsersByIds(
        @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
        ids: number[]) {
        return this.usersService.findByIds(ids);
    }

    // --- Endpoints para agregar-empleados ---

    @Get('listado-basico')
    async getListadoBasico() {
        return this.usersService.findAllBasico();
    }

    @Patch(':id/role')
    async actualizarRol(
        @Param('id') id: string,
        @Body() dto: UpdateUserRoleDto,
    ) {
        return this.usersService.actualizarRol(+id, dto);
    }

    // --- Endpoints para gestion-clientes ---

    @Get('gestion-clientes')
    async getGestionClientes() {
        return this.usersService.findAllGestion();
    }

    @Patch(':id/estado')
    async actualizarEstado(
        @Param('id') id: string,
        @Body() dto: UpdateUserStatusDto,
    ) {
        return this.usersService.actualizarEstado(+id, dto);
    }

    // --- Endpoints para perfil ---

    @Get('perfil')
    async getPerfil(@Headers('x-user-data') userData: string) {
        const parsed = JSON.parse(userData);
        return this.usersService.getPerfil(parsed.id);
    }

    @Put('perfil')
    async actualizarPerfil(
        @Headers('x-user-data') userData: string,
        @Body() dto: UpdatePerfilDto,
    ) {
        const parsed = JSON.parse(userData);
        return this.usersService.actualizarPerfil(parsed.id, dto);
    }
}
