import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
export declare class UsersService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    testConnection(): Promise<void>;
}
