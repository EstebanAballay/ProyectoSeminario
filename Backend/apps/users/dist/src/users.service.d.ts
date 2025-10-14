import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from './role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
export declare class UsersService {
    private readonly userRepo;
    private readonly jwtService;
    constructor(userRepo: Repository<User>, jwtService: JwtService);
    crearUsuario(dto: CreateUserDto): Promise<User>;
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
        role: Role;
    }>;
}
