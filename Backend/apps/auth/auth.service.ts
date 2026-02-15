import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";

import { JwtService } from "@nestjs/jwt";
import * as bcryptjs from "bcryptjs";
import { UsersService } from "../users/src/users.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

async register(registerDto: RegisterDto) {
  const { nombre, apellido, dni, email, celular, CUIT, direccion, password } = registerDto;

  const existingUser = await this.usersService.findOneByEmail(email);
  if (existingUser) {
    throw new BadRequestException("Email already exists");
  }

  await this.usersService.crearUsuario({
    nombre,
    apellido,
    dni,
    email,
    celular,
    CUIT,
    direccion,
    password,
  });

  return {
    message: "User created successfully",
  };
}
  
  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findOneByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException("Invalid email");
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }

    const payload = { id: user.id, email: user.email, role: user.role }; // info que contiene el token

    const token = await this.jwtService.signAsync(payload);

    return {
      token: token,
      email: user.email,
    };
  }
}