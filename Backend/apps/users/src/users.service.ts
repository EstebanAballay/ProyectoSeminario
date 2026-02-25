import { Injectable, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { Role } from './role.enum';
import { UserStatus } from './user-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import * as bcrypt from 'bcrypt';
import * as bcryptjs from 'bcryptjs'; 
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

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
    estado: UserStatus.ACTIVO,
  });

    const guardado = await this.userRepo.save(nuevoUsuario);
    delete (guardado as any).password_hash;
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

  async perfil(email: string) {
    console.log('perfil de service de users back iniciado')
    return this.userRepo.findOne({
      where: { email },
      select: [
        'id',
        'nombre',
        'apellido',
        'dni',
        'email',
        'celular',
        'CUIT',
        'direccion',
        'role',
      ],
    });
  }

  async actualizarPerfil(emailActual: string, dto: UpdatePerfilDto) {
    const usuario = await this.userRepo.findOne({ where: { email: emailActual } });

    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (dto.email && dto.email !== emailActual) {
      const existeEmail = await this.userRepo.findOne({ where: { email: dto.email } });
      if (existeEmail) {
        throw new BadRequestException('El email ya está registrado');
      }
    }

    usuario.nombre = dto.nombre ?? usuario.nombre;
    usuario.apellido = dto.apellido ?? usuario.apellido;
    usuario.email = dto.email ?? usuario.email;
    usuario.celular = dto.celular ?? usuario.celular;
    usuario.CUIT = dto.CUIT ?? usuario.CUIT;
    usuario.direccion = dto.direccion ?? usuario.direccion;

    await this.userRepo.save(usuario);
    return this.perfil(usuario.email);
  }

  
  async findByIds(ids: number[]): Promise<User[]> {
    return this.userRepo.findBy({ id: In(ids) });
  }

  async listarUsuariosNombreDni() {
    return this.userRepo.find({
      select: ['id', 'nombre', 'apellido', 'dni', 'role'],
      order: { nombre: 'ASC' },
    });
  }

  async asegurarEstadoActivoUsuariosExistentes() {
    await this.userRepo
      .createQueryBuilder()
      .update(User)
      .set({ estado: UserStatus.ACTIVO })
      .where('estado IS NULL')
      .execute();
  }

  async listarUsuariosGestionClientes() {
    await this.asegurarEstadoActivoUsuariosExistentes();
    return this.userRepo.find({
      select: ['id', 'nombre', 'apellido', 'dni', 'role', 'estado'],
      order: { nombre: 'ASC' },
    });
  }

  async actualizarRolUsuario(id: number, role: Role) {
    if (!Object.values(Role).includes(role)) {
      throw new BadRequestException('Rol inválido');
    }

    const usuario = await this.userRepo.findOne({ where: { id } });

    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    usuario.role = role;
    await this.userRepo.save(usuario);

    return {
      id: usuario.id,
      nombre: usuario.nombre,
      dni: usuario.dni,
      role: usuario.role,
      estado: usuario.estado,
    };
  }

  async actualizarEstadoUsuario(id: number, estado: UserStatus) {
    if (!Object.values(UserStatus).includes(estado)) {
      throw new BadRequestException('Estado inválido');
    }

    const usuario = await this.userRepo.findOne({ where: { id } });

    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    usuario.estado = estado;
    await this.userRepo.save(usuario);

    return {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      dni: usuario.dni,
      role: usuario.role,
      estado: usuario.estado,
    };
  }

}