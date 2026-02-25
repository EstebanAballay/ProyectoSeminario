import { Controller, Post, Body, Get, UseGuards, Req, Put, Query, ParseArrayPipe, Patch, Param, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from './guard/auth.guard';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { Role } from './role.enum';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UserStatus } from './user-status.enum';
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    private validarAdmin(req: any) {
      if (req?.user?.role !== Role.ADMIN) {
        throw new ForbiddenException('Solo administradores pueden realizar esta acción');
      }
    }
    
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

  @Get('listado-basico')
  @UseGuards(AuthGuard)
  async listadoBasico(@Req() req: any) {
    this.validarAdmin(req);
    return this.usersService.listarUsuariosNombreDni();
  }

  @Get('gestion-clientes')
  @UseGuards(AuthGuard)
  async listadoGestionClientes(@Req() req: any) {
    this.validarAdmin(req);
    return this.usersService.listarUsuariosGestionClientes();
  }

  @Patch(':id/role')
  @UseGuards(AuthGuard)
  async actualizarRolUsuario(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
  ) {
    this.validarAdmin(req);
    return this.usersService.actualizarRolUsuario(id, dto.role);
  }

  @Patch(':id/estado')
  @UseGuards(AuthGuard)
  async actualizarEstadoUsuario(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserStatusDto,
  ) {
    this.validarAdmin(req);

    if (!Object.values(UserStatus).includes(dto.estado)) {
      throw new ForbiddenException('Estado no permitido');
    }

    return this.usersService.actualizarEstadoUsuario(id, dto.estado);
  }
}