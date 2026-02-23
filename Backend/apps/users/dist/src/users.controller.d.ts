import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    registrar(dto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    login(dto: LoginDto): Promise<{
        token: string;
        id: number;
        nombre: string;
        apellido: string;
        dni: string;
        email: string;
        celular: string;
        CUIT: string;
        direccion: string;
        role: import("./role.enum").Role;
    }>;
}
