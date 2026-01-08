import { UsersService } from './users.service';
import { CreateUserDto } from '../../../libs/common/src/dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findByEmail(email: string): Promise<import("./entities/user.entity").User>;
    findByEmailWithPassword(email: string): Promise<import("./entities/user.entity").User>;
    registrar(dto: CreateUserDto): Promise<import("./entities/user.entity").User>;
}
