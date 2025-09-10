import { Injectable } from '@nestjs/common';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { Repository } from 'typeorm';
import { EstadoViaje } from './entities/estadoViaje.entity'
import { Viaje } from './entities/viaje.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ViajeService {
    constructor(
    @InjectRepository(Viaje)
    private readonly viajeRepo: Repository<Viaje>,
    ) {}
        async testConnection() {
    try {
      const count = await this.viajeRepo.count();
      console.log('DB connection works, Viaje count:', count);
    } catch (error) {
      console.error('DB connection failed:', error);
    }
  }
  //constructor(@InjectRepository(EstadoViaje) private estadoViajeRepository: Repository<EstadoViaje>) {}

  create(createViajeDto: CreateViajeDto) {
    return 'This action adds a new viaje';
  }

  findAll() {
    return `This action returns all viaje`;
  }

  findOne(id: number) {
    return `This action returns a #${id} viaje`;
  }
  /*
  update(id: number, updateViajeDto: UpdateViajeDto) {
    return `This action updates a #${id} viaje`;
  }*/

  remove(id: number) {
    return `This action removes a #${id} viaje`;
  }
}
