import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository, Not} from 'typeorm';
import { EstadoViaje } from './entities/estadoViaje.entity';
import { Viaje } from './entities/viaje.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom,lastValueFrom } from 'rxjs';
import { BASE_COORDS, TIEMPO_MUERTO } from '../constantesTiempoViaje';
import { UpdateViajeDto } from './dto/update-viaje.dto';


@Injectable()
export class ViajeService {

  constructor(@InjectRepository(EstadoViaje) private estadoViajeRepository: Repository<EstadoViaje>,
              @InjectRepository(Viaje) private viajeRepository: Repository<Viaje>,
              private readonly httpService: HttpService) {}

  async testConnection() {
          try {
            const count = await this.viajeRepository.count();
            console.log('DB connection works, Viaje count:', count);
          } catch (error) {
            console.error('DB connection failed:', error);
          }
        }

  async createViaje(data: CreateViajeDto,user) {
    //busco el estado PreCargado, que es el estado default
    console.log('Creando viaje con datos:', data);
    console.log('distancia recibida:', data.distancia);
    const estadoDefault = await this.estadoViajeRepository.findOne({ where: { nombre: 'PreCargado' } });
    const {fecha, hora} = await this.calcularFechaRegreso(data.origenCoords, data.destinoCoords,BASE_COORDS,data.fechaInicio, TIEMPO_MUERTO) //convertir horas a segundos
    const viaje = this.viajeRepository.create({
      //asignar fecha reserva
      //calcular fecha hora hora llegada
      //calcular total
      fechaReserva: new Date(),
      fechaInicio: new Date(data.fechaInicio), 
      destinoInicio: data.destinoInicio,
      horaSalida: data.horaSalida.length === 5 ? `${data.horaSalida}:00` : data.horaSalida, //si la long es 5 le agrego :00 para segundos
      fechaFin: fecha, //Cambiar esto cuando se integre con el front.Aqui debe ir la fecha de regreso calculada en funcion de la duracion del viaje.
      horaLlegada: hora, //hora de llegada de vuelta al origen
      destinoFin: data.destinoFin,
      sena: 0,
      resto: 0,
      total: 0,
      estadoViaje: estadoDefault, // lo creo en estado precargado
      distancia: data.distancia,
      usuarioId: user.id,
      CoordXOrigen: data.origenCoords.lat,
      CoordYOrigen: data.origenCoords.lng,
      CoordXDestino: data.destinoCoords.lat,
      CoordYDestino: data.destinoCoords.lng
    });
 
    //Guarda el nuevo viaje
    const savedViaje = await this.viajeRepository.save(viaje);
    //Json dto para unidades
    const unidades = data.unidades
    console.log('Unidades a agregar al viaje:', unidades);
    for (const unidad of unidades) {
      //creo la unidad y me quedo con su id y subtotal
      const nuevaUnidad = await this.agregarUnidad(unidad,savedViaje.ViajeId);
      const nuevaUnidadId = nuevaUnidad.id;
      //calculo el total del viaje
      const total = Math.trunc((nuevaUnidad.subtotal * data.distancia)*100)/100; //redondeo a 2 decimales
      //asigno el id de la unidad al viaje
      savedViaje.unidades.push(nuevaUnidadId);
      //asigno el total del viaje
      savedViaje.total += total;
    }
    //calculo y asigno la senia del viaje
    savedViaje.sena += Math.trunc((savedViaje.total * 0.1)*100)/100; //10% del total, redondeado a 2 decimales
    //calculo y asigno el resto del viaje
    savedViaje.resto += Math.trunc((savedViaje.total - savedViaje.sena)*100)/100; //redondeado a 2 decimales
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
    return {id: response.data.UnidadId, subtotal: response.data.subtotal};
      }  
    catch (error) {
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
    //unidadesOcupadas son los acoplados,semis y camiones que estan en los viajes en el rango,es decir,que no estan disponibles
    const unidadesOcupadas = viajesEnRango.flatMap(v => v.unidades);
    console.log('Unidades ocupadas en el rango:', unidadesOcupadas);
    //Pedir unidades disponibles al microservicio de unidad
    try {
      const dto = { unidadesOcupadas: unidadesOcupadas, camiones: camiones };
      console.log('el dto con unidadesOcupadas y tipos de camiones',dto);
      const response = await firstValueFrom(
        this.httpService.post('http://unidad-service:3002/unidad/unidadesDisponibles', dto) //uso post porque le mando un body
      );
      console.log('UnidadesDisponibles:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al buscar la unidad:', error.message);
    }

  }

  // Cambiamos el tipo de retorno a un objeto con fecha y hora
async calcularFechaRegreso(origenCoords, destinoCoords, baseCoords, fechaInicio, tiempoMuerto): Promise<{ fecha: string; hora: string }> {

  const coords = `${baseCoords.lng},${baseCoords.lat};${origenCoords.lng},${origenCoords.lat};${destinoCoords.lng},${destinoCoords.lat};${baseCoords.lng},${baseCoords.lat}`;
  const url = `http://router.project-osrm.org/route/v1/driving/${coords}?overview=false`;

  try {
    //obtengo el ruteo al servicio de OSRM
    const response = await firstValueFrom(this.httpService.get(url));
    //con el servicio,puedo calcular los tiempos
    const duracionTransitoSegundos = response.data.routes[0].duration;

    // Convertimos tiempos muertos a segundos
    const tiempoTotalSegundos = duracionTransitoSegundos + tiempoMuerto * 3600;

    // Calculamos el objeto Date completo
    const fechaCompleta = new Date(new Date(fechaInicio).getTime() + tiempoTotalSegundos * 1000);
    
    // Extraemos la fecha en formato YYYY-MM-DD
    const fecha = fechaCompleta.toISOString().split('T')[0];
    
    // Extraemos la hora en formato HH:mm:ss
    const hora = fechaCompleta.toTimeString().split(' ')[0];

    return { fecha, hora };
    
  } catch (error) {
    console.error('Error calculando ruteo:', error);
    throw new Error('No se pudo calcular la fecha de regreso');
  }
}


  buscarTodos(user) {
    const viajes = this.viajeRepository.find(user.id);
    console.log(viajes);
    return viajes;
  }

 // Importaciones necesarias arriba

async getViajesPendientes() {
  // 1. Busco el estado Pendiente
  const estadoPendiente = await this.estadoViajeRepository.findOne({ where: { id: 2 } });
  
  // 2. Busco los viajes (Metadata básica)
  const viajes = await this.viajeRepository.find({ where: { estadoViaje: estadoPendiente } });

  // 3. "Hidratamos" cada viaje buscando sus unidades en el otro microservicio
  const viajesConUnidades = await Promise.all(viajes.map(async (viaje) => {
    try {
      // Hacemos la petición al servicio de unidades
      const { data: unidades } = await lastValueFrom(
        this.httpService.get('http://unidad-service:3002/unidad/', {
          params: { idViaje: viaje.ViajeId } 
        })
      );

      // 4. Retornamos el viaje original + el array de unidades real
      return {
        ...viaje,      // Copia todas las propiedades del viaje (origen, destino, etc)
        unidades: unidades // Agrega/Sobreescribe la propiedad unidades con el array lleno
      };

    } catch (error) {
      console.error(`Error al buscar unidades para viaje ${viaje.ViajeId}`, error);
      // Si falla el microservicio de unidades, devolvemos el viaje con lista vacía para no romper todo
      return { ...viaje, unidades: [] };
    }
  }));

  console.log('Viajes completos recuperados:', viajesConUnidades);
  return viajesConUnidades;
}

  async getChoferesDisponibles(fechaInicio: Date, fechaFin: Date) {
    //Busco los viajes en el rango y que no esten cancelados
    const viajesEnRango = await this.viajeRepository.find({
      where: 
        { fechaInicio: LessThanOrEqual(fechaFin), fechaFin: MoreThanOrEqual(fechaInicio),estadoViaje: {id: Not(3)} } //solo los viajes asignados,
      
    });
    console.log('Viajes en el rango para choferes:', viajesEnRango);
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://unidad-service:3002/unidad/choferesDisponibles', viajesEnRango)
      );
      console.log('Choferes disponibles:', response.data);
      return response.data;
    }  
    catch (error) {
      console.error('Error al buscar los choferes:', error.message);
    }

  }

  async asignarChoferes(viajeId:number, asignaciones: {unidadId: number, choferId: number}[]) {
    // Lllamar al servicio de unidad para actualizar los choferes asignados
    try {
      console.log(asignaciones);
      const response = await firstValueFrom(
        this.httpService.post('http://unidad-service:3002/unidad/asignarChoferes',{asignaciones})
      );
      //Actualizo el viaje solo si logro asignar los choferes
      await this.viajeRepository.update(viajeId, {estadoViaje: {id:4}}); //cambio el estado pendiente de pago
      console.log('choferes asignados y viaje actualizado')
      
    }  
    catch (error) {
      console.error('Error al asignar los choferes:', error.message);
    }
  }

  async rechazarViaje(viajeId: number) {
    await this.viajeRepository.update(viajeId, { estadoViaje: { id: 3 } }); }

  async findAll(): Promise<Viaje[]> {
    return await this.viajeRepository.find({
      relations: ['chofer', 'estadoViaje', 'unidad', 'transportista'],
    });
  }
  
  findOne(id: number) {
    return this.viajeRepository.findOne({ where: { ViajeId: id } });
  }

  /*
  update(id: number, updateViajeDto: UpdateViajeDto) {
    return `This action updates a #${id} viaje`;
  }*/

  remove(id: number) {
    return `This action removes a #${id} viaje`;
  }

//xddd

  async enViaje(viajeId: number) {
    // El parámetro 'unidadId' parece ser el 'viajeId' según la lógica 
    // de los otros métodos ('finalizarViaje'); 

    // 1. Encontrar el estado "En Viaje"
    const estadoEnViaje = await this.estadoViajeRepository.findOne({
      where: { nombre: 'En Viaje' }, // Asegúrate que este sea el nombre correcto en tu BD
    });

    if (!estadoEnViaje) {
      throw new NotFoundException(`No existe el estado 'En Viaje' en la tabla EstadoViaje`);
    }

    const viaje = await this.viajeRepository.findOne({
      where: { ViajeId: viajeId },
    });

    // 5. Asignar el nuevo estado y guardar
    viaje.estadoViaje = estadoEnViaje;
    await this.viajeRepository.save(viaje);

    //peticion a unidad-service para actualizar el estado del viaje en las unidades asociadas
try {
  const response = await firstValueFrom(
    this.httpService.post('http://unidad-service:3002/unidad/iniciarEstadoViaje', {
      viajeId: viaje.ViajeId,
    })
  );
  console.log('Respuesta de unidad-service:', response.data);
}
catch (error) {
  console.error('Error al actualizar el estado del viaje en unidad-service:', error.message);
}

    return {
      mensaje: `El viaje ${viaje.ViajeId} ha comenzado.`,
      viaje,
    };
  }

  async finalizarViaje(viajeId: number) {
  const estadoFinalizado = await this.estadoViajeRepository.findOne({
    where: { nombre: 'Finalizado' },
  });

  if (!estadoFinalizado) {
    throw new NotFoundException(`No existe el estado 'Finalizado' en la tabla EstadoViaje`);
  }

  // Buscar el viaje por el id obtenido de la unidad
  const viaje = await this.viajeRepository.findOne({
    where: { ViajeId: viajeId },
  });

  if (!viaje) {
    throw new NotFoundException(`No se encontró el viaje con id ${viajeId}`);
  }

  // Asignar el nuevo estado y guardar el viaje
  viaje.estadoViaje = estadoFinalizado;
  await this.viajeRepository.save(viaje);

 //peticion a unidad-service para actualizar el estado del viaje en las unidades asociadas
try {
  const response = await firstValueFrom(
    this.httpService.post('http://unidad-service:3002/unidad/finalizarEstadoViaje', {
      viajeId: viaje.ViajeId,
    })
  );
  console.log('Respuesta de unidad-service:', response.data);
}
catch (error) {
  console.error('Error al actualizar el estado del viaje en unidad-service:', error.message);
}

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