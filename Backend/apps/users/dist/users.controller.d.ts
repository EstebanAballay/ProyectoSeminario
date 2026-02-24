import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { Role } from './role.enum';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UserStatus } from './user-status.enum';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    private validarAdmin;
    register(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    perfil(req: any): Promise<import("./entities/user.entity").User>;
    actualizarPerfil(req: any, dto: UpdatePerfilDto): Promise<import("./entities/user.entity").User>;
    getUsersByIds(ids: number[]): Promise<import("./entities/user.entity").User[]>;
    listadoBasico(req: any): Promise<import("./entities/user.entity").User[]>;
    listadoGestionClientes(req: any): Promise<import("./entities/user.entity").User[]>;
    actualizarRolUsuario(req: any, id: number, dto: UpdateUserRoleDto): Promise<{
        id: number;
        nombre: string;
        dni: string;
        role: Role;
        estado: UserStatus;
    }>;
    actualizarEstadoUsuario(req: any, id: number, dto: UpdateUserStatusDto): Promise<{
        id: number;
        nombre: string;
        apellido: string;
        dni: string;
        role: Role;
        estado: UserStatus;
    }>;
}
