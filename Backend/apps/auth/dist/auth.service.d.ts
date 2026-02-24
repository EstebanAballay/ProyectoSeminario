import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    login({ email, password }: LoginDto): Promise<{
        token: string;
        email: string;
    }>;
}
