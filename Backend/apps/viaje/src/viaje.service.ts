import { Injectable } from '@nestjs/common';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { EstadoViaje } from './entities/estadoViaje.entity';
import { Viaje } from './entities/viaje.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BASE_COORDS, TIEMPO_MUERTO } from '../constantesTiempoViaje';

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
      usuarioId: user.id
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


  findAll(user) {
    const viajes = this.viajeRepository.find(user.id);
    console.log(viajes);
    return viajes;
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
