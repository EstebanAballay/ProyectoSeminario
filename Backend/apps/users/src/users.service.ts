import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from './role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
  @InjectRepository(User)
  private readonly userRepo: Repository<User>,
  ) {}
  async crearUsuario(dto: CreateUserDto) {

    // Verificar si ya existe un usuario con ese email
    const existente = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existente) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Hashear la contraseña
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


  async findOneByEmail(email: string) {
    return await this.userRepo.findOneBy({ email });
  }

  async findOneByEmailWithPassword(email: string) {
    return await this.userRepo.findOne({
      where: { email },
      select: ['id', 'nombre', 'email', 'password_hash', 'role'],
    });
  }
}