import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UsersService {
  constructor(
  @InjectRepository(User)
  private readonly userRepo: Repository<User>,
  ) {}
    async testConnection() { //Test de conexion en la base de datos
    try {
      const count = await this.userRepo.count();
      console.log('DB connection works, User count:', count);
    } catch (error) {
      console.error('DB connection failed:', error);
    }
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('El email ya está registrado.');
    }

    const newUser = this.userRepo.create(createUserDto);
    return this.userRepo.save(newUser);
  }

  async findOneByEmail(email: string) {
    return await this.userRepo.findOneBy({ email });
  }
}
