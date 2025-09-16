import { Injectable } from '@nestjs/common';
import { CreateViajeDto } from './dto/create-viaje.dto';
//import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoViaje } from './entities/estadoViaje.entity'
import {InjectRepository } from '@nestjs/typeorm';
import { Viaje } from './entities/viaje.entity';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class ViajeService {
  constructor(@InjectRepository(Viaje) private viajeRepository: Repository<Viaje>) {}
  create(createViajeDto: CreateViajeDto) {
    return 'This action adds a new viaje';
  }

  

  async findAll(): Promise<Viaje[]> {
    return await this.viajeRepository.find({
      relations: ['chofer', 'estadoViaje', 'unidad', 'transportista'],
    });
  }
  

  findOne(id: number) {
    return `This action returns a #${id} viaje`;
  }
  /*
  update(id: number, updateViajeDto: UpdateViajeDto) {
    return `This action updates a #${id} viaje`;
  }*/

  async updateStateTravel(id: number, nuevoEstado: string){
      const viaje = await this.viajeRepository.findOne({ 
        where: { idViaje: id }
       });
      
      if (!Viaje) {
        throw new NotFoundException(`No se encontró el viaje ${id}`);
      }
  
      viaje.idEstadoViaje = 7;
      return this.viajeRepository.save(viaje);
    }
  

  remove(id: number) {
    return `This action removes a #${id} viaje`;
  }

async ConfirmTravel(id: number, confirmarViaje: string){
      const viaje = await this.viajeRepository.findOne({ 
        where: { idViaje: id }
       });
      
      if (!Viaje) {
        throw new NotFoundException(`No se encontró el viaje ${id}`);
      }
      
      const estadoviaje = await this.estadoViajeRepository.findOne({ 
        where: { nombre: "pendienteDePago" }
       });
      viaje.estadoViaje = estadoviaje;
      return this.viajeRepository.save(viaje);

      
    }

}
