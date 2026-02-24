import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from './role.enum';
import { UserStatus } from './user-status.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
export declare class UsersService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    crearUsuario(dto: CreateUserDto): Promise<User>;
    findOneByEmail(email: string): Promise<User>;
    findOneByEmailWithPassword(email: string): Promise<User>;
    perfil(email: string): Promise<User>;
    actualizarPerfil(emailActual: string, dto: UpdatePerfilDto): Promise<User>;
    findByIds(ids: number[]): Promise<User[]>;
    listarUsuariosNombreDni(): Promise<User[]>;
    asegurarEstadoActivoUsuariosExistentes(): Promise<void>;
    listarUsuariosGestionClientes(): Promise<User[]>;
    actualizarRolUsuario(id: number, role: Role): Promise<{
        id: number;
        nombre: string;
        dni: string;
        role: Role;
        estado: UserStatus;
    }>;
    actualizarEstadoUsuario(id: number, estado: UserStatus): Promise<{
        id: number;
        nombre: string;
        apellido: string;
        dni: string;
        role: Role;
        estado: UserStatus;
    }>;
}
