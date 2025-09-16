import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';




@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private UserRepository:Repository<User>,
){}


    async findUnityByDriver(idusuario: number): Promise<Unidad[]> {
    return this.UnidadesRepository.find({
      where: { idTransportista: idusuario },
    });
  }
    crearUser(CreateUserDto){
        const nuevo = this.UserRepository.create(CreateUserDto);
        return 'This action adds a new unidad';

      }
     
}
