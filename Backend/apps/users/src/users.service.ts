import { Injectable, BadRequestException, UnauthorizedException} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from './role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
  @InjectRepository(User)
  private readonly userRepo: Repository<User>,
  ) {}
  async crearUsuario(dto: CreateUserDto) { // metodo para crear usuarios
  console.log('🟢 SERVICE REGISTER START');
    // verifica si ya existe un usuario con ese email
    const existente = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existente) {
        console.log('🚫 USER ALREADY EXISTS');
      throw new BadRequestException('El email ya está registrado'); // notifica que el email ya esta en la bd
    }
console.log('🔐 PASSWORD RAW:', dto.password);
    // Hashear la contraseña
const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(dto.password, salt); // la guarda en passwordHash

  const nuevoUsuario = this.userRepo.create({ // guarda el usuario
    nombre: dto.nombre,
    apellido: dto.apellido,
    dni: dto.dni,
    email: dto.email,
    celular: dto.celular,
    CUIT: dto.CUIT,
    direccion: dto.direccion,
    password_hash: passwordHash,
    role: Role.CLIENT, // por defecto guarda el usuario como cliente, para crear con otros roles se hace POR AHORA desde la base de datos
    // la idea es que el admin pueda crear choferes y mecanicos
  });
console.log('🧱 NUEVO USUARIO A GUARDAR:', nuevoUsuario);
  const guardado = await this.userRepo.save(nuevoUsuario);
  delete guardado.password_hash;
  return guardado; // retorna el usuario recien creado sin el hash de la contraseña
  }


  async findOneByEmail(email: string) { // metodo para encontrar un mail en la bd
    return await this.userRepo.findOneBy({ email });
  }

  findOneByEmailWithPassword(email: string) { // metodo para encontrar un usuario por mail incluyendo su contraseña en la devolucion
    return this.userRepo.findOne({ // este metodo lo usa el auth.service
      where: { email },
      select: ['id', 'nombre', 'email', 'password_hash', 'role'],
  });
}
}