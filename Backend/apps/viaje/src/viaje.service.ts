import { Injectable } from '@nestjs/common';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoViaje } from './entities/estadoViaje.entity';
import { Viaje } from './entities/viaje.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ViajeService {

  constructor(@InjectRepository(EstadoViaje) private estadoViajeRepository: Repository<EstadoViaje>,
              @InjectRepository(Viaje) private viajeRepository: Repository<Viaje>,
              private readonly httpService: HttpService) {}


  async createViaje(data: CreateViajeDto) {
    const estadoDefault = await this.estadoViajeRepository.findOne({ where: { nombre: 'PreCargado' } });
    const viaje = this.viajeRepository.create({
      //asignar fecha reserva
      //calcular fecha hora hora llegada
      //calcular total
    fechaReserva: new Date(),
    fechaInicio: data.fechaInicio,
    destinoInicio: data.destinoInicio.toString(),
    destinoFin: data.destinoFin.toString(),
    horaSalida: data.horaSalida.toString(),
    estadoViaje: estadoDefault // lo creo en estado precargado
    });

    //Json dto para unidades
    const unidades = data.unidades
    for (const unidad of unidades) {
      this.agregarUnidad(unidad,viaje.ViajeId);
    }
    return this.viajeRepository.save(viaje);
  }

  async agregarUnidad(unidad: any,viajeId:number) {
    const unidadCompleta = {...unidad, viajeId} //asignar el id del viaje creado
    const nuevaUnidad = await this.httpService.post('http://localhost:3003/unidad',unidadCompleta);
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
