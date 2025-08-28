import { Injectable } from '@nestjs/common';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';

@Injectable()
export class ViajeService {
  create(createViajeDto: CreateViajeDto) {
    return 'This action adds a new viaje';
  }

  findAll() {
    return `This action returns all viaje`;
  }

  findOne(id: number) {
    return `This action returns a #${id} viaje`;
  }

  update(id: number, updateViajeDto: UpdateViajeDto) {
    return `This action updates a #${id} viaje`;
  }

  remove(id: number) {
    return `This action removes a #${id} viaje`;
  }
}
