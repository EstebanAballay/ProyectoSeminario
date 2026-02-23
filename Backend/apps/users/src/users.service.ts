import { Injectable, BadRequestException, UnauthorizedException} from '@nestjs/common';
import { User } from './entities/user.entity';
<<<<<<< HEAD
import { In, Repository } from 'typeorm';
=======
import { Repository } from 'typeorm';
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
import { Role } from './role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
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

    // 1️⃣ Verificar si ya existe un usuario con ese email
    const existente = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existente) {
      throw new BadRequestException('El email ya está registrado');
    }

    // 2️⃣ Hashear la contraseña
const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(dto.password, salt);

  const nuevoUsuario = this.userRepo.create({
    nombre: dto.nombre,
    apellido: dto.apellido,
    dni: dto.dni,
    email: dto.email,
    celular: dto.celular,
    CUIT: dto.CUIT,
    direccion: dto.direccion,
    password_hash: passwordHash,
    role: Role.CLIENT,
  });

  const guardado = await this.userRepo.save(nuevoUsuario);
  delete guardado.password_hash;
  return guardado;
  }

  async login(dto: LoginDto) {
    console.log('intentando login');
    // 1️⃣ Buscar el usuario por email
    const usuario = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!usuario) {
      console.log('no encuentra el usuario');
      throw new UnauthorizedException('Email o contraseña incorrecta'); //Manda el error que despues muestra el login.component.ts con el mensaje 
    }

    // 2️⃣ Verificar contraseña
    const isMatch = await bcrypt.compare(dto.password, usuario.password_hash);
    console.log('verificando contraseña');
    if (!isMatch) {
      console.log('no coinciden');
      throw new UnauthorizedException('Email o contraseña incorrecta');
    }
    const token = this.jwtService.sign({ id: usuario.id, email: usuario.email, role: usuario.role });
    // 3️⃣ Retornar datos del usuario sin la contraseña
    const { password_hash, ...rest } = usuario;
    return { ...rest, token };
  }
  async findOneByEmail(email: string) {
    return await this.userRepo.findOneBy({ email });
  }

  findOneByEmailWithPassword(email: string) {
    return this.userRepo.findOne({
      where: { email },
      select: ['id', 'nombre', 'email', 'password_hash', 'role'],
<<<<<<< HEAD
      });
    }
  
  async findByIds(ids: number[]): Promise<User[]> {
    return this.userRepo.findBy({ id: In(ids) });
  }

=======
  });
}
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
}