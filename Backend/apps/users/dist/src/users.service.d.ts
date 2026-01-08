import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    crearUsuario(dto: CreateUserDto): Promise<User>;
    findOneByEmail(email: string): Promise<User>;
    findOneByEmailWithPassword(email: string): Promise<User>;
}
