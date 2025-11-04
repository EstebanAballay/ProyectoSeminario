import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { EstadoViaje } from './entities/estadoViaje.entity';
import { Viaje } from './entities/viaje.entity';
import { HttpService } from '@nestjs/axios';
<<<<<<< HEAD
import { Unidad } from '../../unidad/src/entities/unidad.entity';
import { UpdateViajeDto } from './dto/update-viaje.dto';
=======
import { firstValueFrom } from 'rxjs';
>>>>>>> 364f7fddaa9bbefdb9bd3ef8f527cc69143a4829

@Injectable()
export class ViajeService {

  constructor(@InjectRepository(EstadoViaje) private estadoViajeRepository: Repository<EstadoViaje>,
              @InjectRepository(Viaje) private viajeRepository: Repository<Viaje>,
               @InjectRepository(Unidad) private unidadRepository: Repository<Unidad>,
              private readonly httpService: HttpService) {}

<<<<<<< HEAD
=======
  async testConnection() {
          try {
            const count = await this.viajeRepository.count();
            console.log('DB connection works, Viaje count:', count);
          } catch (error) {
            console.error('DB connection failed:', error);
          }
        }

>>>>>>> 364f7fddaa9bbefdb9bd3ef8f527cc69143a4829
  async createViaje(data: CreateViajeDto) {
    //busco el estado PreCargado, que es el estado default
    console.log('Creando viaje con datos:', data);
    const estadoDefault = await this.estadoViajeRepository.findOne({ where: { nombre: 'PreCargado' } });
    const viaje = this.viajeRepository.create({
      //asignar fecha reserva
      //calcular fecha hora hora llegada
      //calcular total
      fechaReserva: new Date(),
      fechaInicio: new Date(data.fechaInicio), 
      destinoInicio: data.destinoInicio,
      horaSalida: data.horaSalida.length === 5 ? `${data.horaSalida}:00` : data.horaSalida, //si la long es 5 le agrego :00 para segundos
      fechaFin: new Date(data.fechaFin), //Cambiar esto cuando se integre con el front.Aqui debe ir la fecha de regreso calculada en funcion de la duracion del viaje.
      horaLlegada: '17:00:00',
      destinoFin: data.destinoFin,
      sena: 0,
      resto: 0,
      total: 0,
      estadoViaje: estadoDefault // lo creo en estado precargado
    });
 
    //Guarda el nuevo viaje
    const savedViaje = await this.viajeRepository.save(viaje);
    //Json dto para unidades
    const unidades = data.unidades
    console.log('Unidades a agregar al viaje:', unidades);
    for (const unidad of unidades) {
      //creo la unidad y me quedo con su id
      const nuevaUnidadId = await this.agregarUnidad(unidad,savedViaje.ViajeId);
      //asigno el id de la unidad al viaje
      savedViaje.unidades.push(nuevaUnidadId);
    }
    await this.viajeRepository.save(savedViaje);
    return savedViaje;
  }

  async agregarUnidad(unidad: any,viajeId:number) {
    const unidadCompleta = {...unidad, viajeId} //asignar el id del viaje creado
    console.log('🚀 Enviando unidad a unidad-service:', unidadCompleta);
    try {
    const response = await firstValueFrom(
      this.httpService.post('http://unidad-service:3002/unidad', unidadCompleta)
    );
    console.log('Unidad creada:', response.data);
    return response.data.UnidadId;
  } catch (error) {
    console.error('Error al crear la unidad:', error.message);
  }
  }

  async buscarUnidadesDisponibles(fechaInicio: Date, fechaFin: Date, camiones:any) {
    //Buscar unidades ocupadas en este rango

    const viajesEnRango = await this.viajeRepository.find({
      where: [
        { fechaInicio: LessThanOrEqual(fechaFin), fechaFin: MoreThanOrEqual(fechaInicio) },
      ]
    });
    console.log('Viajes en el rango:', viajesEnRango);
    const unidadesOcupadas = viajesEnRango.flatMap(v => v.unidades);
    console.log('Unidades ocupadas en el rango:', unidadesOcupadas);
    //Pedir unidades disponibles al microservicio de unidad
    try {
      const dto = { unidadesOcupadas: unidadesOcupadas, camiones: camiones };
      const response = await firstValueFrom(
        this.httpService.post('http://unidad-service:3002/unidad/unidadesDisponibles', dto) //uso post porque le mando un body
      );
      console.log('UnidadesDisponibles:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al buscar la unidad:', error.message);
    }

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