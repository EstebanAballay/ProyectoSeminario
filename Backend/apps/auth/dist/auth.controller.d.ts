import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
interface RequestWithUser extends Request {
    user: {
        email: string;
        role: string;
    };
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        token: string;
        email: string;
    }>;
    profile(req: RequestWithUser): {
        email: string;
        role: string;
    };
}
export {};
