import { Injectable, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { Role } from './role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcryptjs from 'bcryptjs'; 
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async crearUsuario(dto: CreateUserDto) {
    const existente = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existente) {
      throw new BadRequestException('El email ya está registrado');
    }

    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(dto.password, salt);

    const nuevoUsuario = this.userRepo.create({
      ...dto,
      password_hash: passwordHash,
      role: Role.CLIENT,
    });

    const guardado = await this.userRepo.save(nuevoUsuario);
    delete (guardado as any).password_hash;
    return guardado;
  }

  async login(dto: LoginDto) {
    // 1️⃣ LOG CRUCIAL: Si no ves esto en Docker al intentar loguearte, el problema es el Controller o Angular
    console.log('--- INTENTO DE LOGIN RECIBIDO EN SERVICIO ---');
    console.log('DTO recibido:', JSON.stringify(dto));

    if (!dto.password) {
      console.error('❌ ERROR: El campo password llegó indefinido');
      throw new BadRequestException('Illegal arguments: password is required');
    }

    const usuario = await this.findOneByEmailWithPassword(dto.email);
    
    if (!usuario) {
      console.log('Usuario no encontrado en DB');
      throw new UnauthorizedException('Email o contraseña incorrecta');
    }

    try {
      // 2️⃣ Comparación usando la versión JS para evitar errores de binarios en Docker
      const isMatch = await bcryptjs.compare(dto.password, usuario.password_hash);
      
      if (!isMatch) {
        console.log('Contraseña no coincide');
        throw new UnauthorizedException('Email o contraseña incorrecta');
      }

      console.log('✅ Login exitoso para:', usuario.email);

      // 3️⃣ Generación de Token
      const token = this.jwtService.sign({ 
          id: usuario.id, 
          email: usuario.email, 
          role: usuario.role 
      });

      const { password_hash, ...rest } = usuario;
      return { ...rest, token };

    } catch (error) {
      console.error('Error durante el proceso de login:', error.message);
      throw new InternalServerErrorException('Error interno en la autenticación');
    }
  }

  async findOneByEmail(email: string) {
    return await this.userRepo.findOneBy({ email });
  }

  async findOneByEmailWithPassword(email: string) {
    return await this.userRepo.findOne({
      where: { email },
      select: ['id', 'nombre', 'email', 'password_hash', 'role'], 
    });
  }
  
  async findByIds(ids: number[]): Promise<User[]> {
    return this.userRepo.findBy({ id: In(ids) });
  }
}