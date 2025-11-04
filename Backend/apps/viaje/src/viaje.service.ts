import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoViaje } from './entities/estadoViaje.entity';
import { Viaje } from './entities/viaje.entity';
import { HttpService } from '@nestjs/axios';
import { Unidad } from '../../unidad/src/entities/unidad.entity';
import { UpdateViajeDto } from './dto/update-viaje.dto';

@Injectable()
export class ViajeService {

  constructor(@InjectRepository(EstadoViaje) private estadoViajeRepository: Repository<EstadoViaje>,
              @InjectRepository(Viaje) private viajeRepository: Repository<Viaje>,
               @InjectRepository(Unidad) private unidadRepository: Repository<Unidad>,
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
        where: { ViajeId: id }
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
        where: { ViajeId: id }
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

  async enViaje(unidadId: number, choferId: number, data: UpdateViajeDto) {
    // El parámetro 'unidadId' parece ser el 'viajeId' según la lógica 
    // de los otros métodos ('finalizarViaje')
    const viajeId = unidadId; 

    // 1. Encontrar el estado "En Viaje"
    const estadoEnViaje = await this.estadoViajeRepository.findOne({
      where: { nombre: 'En Viaje' }, // Asegúrate que este sea el nombre correcto en tu BD
    });

    if (!estadoEnViaje) {
      throw new NotFoundException(`No existe el estado 'En Viaje' en la tabla EstadoViaje`);
    }

    // 2. Buscar la unidad asociada al viaje
    const unidad = await this.unidadRepository.findOne({
      where: { idViaje: viajeId },
    });

    if (!unidad) {
      throw new NotFoundException(`No se encontró una unidad asociada al viaje ${viajeId}`);
    }

    // 3. VALIDACIÓN: Comprobar que el choferId coincida con el transportista de la unidad
    // Asumiendo que 'choferId' es el 'transportistaId'
    if (unidad.transportistaId !== choferId) { 
      throw new NotFoundException(
        `El chofer ${choferId} no está asignado a la unidad del viaje ${viajeId}`
      );
    }

    // 4. Buscar el viaje
    const viaje = await this.viajeRepository.findOne({ 
      where: { ViajeId: viajeId },
    });
    
    if (!viaje) {
      throw new NotFoundException(`No se encontró el viaje con id ${viajeId}`);
    }

    // 5. Asignar el nuevo estado y guardar
    viaje.estadoViaje = estadoEnViaje;
    await this.viajeRepository.save(viaje);

    return {
      mensaje: `El viaje ${viaje.ViajeId} ha comenzado.`,
      viaje,
    };
  }

  async finalizarViaje(unidadId: number, choferId: number) {
  const estadoFinalizado = await this.estadoViajeRepository.findOne({
    where: { nombre: 'Finalizado' },
  });

  if (!estadoFinalizado) {
    throw new NotFoundException(`No existe el estado 'Finalizado' en la tabla EstadoViaje`);
  }

  // Buscar el viaje asociado a la unidad
  const unidad = await this.unidadRepository.findOne({
    where: { idViaje: unidadId },
    relations: ['viaje'],
  });

  if (!unidad || !unidad.idViaje) {
    throw new NotFoundException(`No se encontró el viaje asociado a la unidad ${unidadId}`);
  }

  // Buscar el viaje por el id obtenido de la unidad
  const viaje = await this.viajeRepository.findOne({
    where: { ViajeId: unidad.idViaje },
  });

  if (!viaje) {
    throw new NotFoundException(`No se encontró el viaje con id ${unidad.idViaje}`);
  }

  // Asignar el nuevo estado y guardar el viaje
  viaje.estadoViaje = estadoFinalizado;
  viaje.fechaFin = new Date(); // opcional: si tu entidad tiene campo fechaFin
  await this.viajeRepository.save(viaje);

  return {
    mensaje: `El viaje ${viaje.ViajeId} fue finalizado correctamente`,
    viaje,
  };
}

  async cancelarViaje(viajeId: number, choferId: number, motivo?: string) {
    const viaje = await this.viajeRepository.findOne({
      where: { ViajeId: viajeId },
      relations: ['estadoViaje'],
    });

    if (!viaje) {
      throw new NotFoundException(`No se encontró el viaje ${viajeId}`);
    }

    const estadoCancelado = await this.estadoViajeRepository.findOne({
      where: { nombre: 'Cancelado' },
    });

    if (!estadoCancelado) {
      throw new NotFoundException(`No existe el estado 'Cancelado' en la tabla EstadoViaje`);
    }

    // Asignar estado y fecha de fin
    viaje.estadoViaje = estadoCancelado;
    viaje.fechaFin = new Date();

    
    (viaje as any).motivoCancelacion = motivo ?? null;

    const viajeGuardado = await this.viajeRepository.save(viaje);

    return {
      mensaje: `El viaje ${viajeGuardado.ViajeId} fue cancelado correctamente.`,
      viaje: viajeGuardado,
    };
  }
}