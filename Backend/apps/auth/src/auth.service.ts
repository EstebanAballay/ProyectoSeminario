import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcryptjs from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  private usersUrl = "http://users:3001/users";

  constructor(
    private readonly http: HttpService,
    private readonly jwtService: JwtService
  ) {}

  // ---------------------------
  //  Métodos auxiliares HTTP
  // ---------------------------
  private async findOneByEmail(email: string) {
    console.log('findOneByEmail de auth.service llamado');
    try {
      const res = await firstValueFrom(
        this.http.get(`${this.usersUrl}/by-email/${email}`)
      );
      return res.data;
    } catch {
      return null;
    }
  }

  private async findOneByEmailWithPassword(email: string) {
    try {
      const res = await firstValueFrom(
        this.http.get(`${this.usersUrl}/by-email-password/${email}`)
      );
      return res.data;
    } catch {
      return null;
    }
  }

  private async crearUsuario(data: any) {
    console.log('crearUsuario de auth.service llamado');
    await firstValueFrom(this.http.post(`${this.usersUrl}`, data));
  }

  // ---------------------------
  //        REGISTER
  // ---------------------------
  async register(registerDto: RegisterDto) {
        console.log('register de auth.service llamado: ', registerDto);
    const {
      nombre,
      apellido,
      dni,
      email,
      celular,
      CUIT,
      direccion,
      password,
    } = registerDto;

    const existingUser = await this.findOneByEmail(email);

    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    await this.crearUsuario({
      nombre,
      apellido,
      dni,
      email,
      celular,
      CUIT,
      direccion,
      password,
    });

    return { message: "User created successfully" };
  }

  // ---------------------------
  //          LOGIN
  // ---------------------------
  async login({ email, password }: LoginDto) {
      console.log("🟢 SERVICE LOGIN START");
    const user = await this.findOneByEmailWithPassword(email);

    if (!user) {
      console.log("🟡 USER NOT FOUND");
      throw new UnauthorizedException("Invalid email");
    }

    const isPasswordValid = await bcryptjs.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      console.log("🔴 PASSWORD INVALID");
      throw new UnauthorizedException("Invalid password");
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);
      console.log("✅ LOGIN OK, TOKEN GENERATED");
    return {
      token,
      email: user.email,
    };
  }
}
