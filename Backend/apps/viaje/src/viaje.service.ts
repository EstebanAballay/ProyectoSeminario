import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { InjectRepository } from '@nestjs/typeorm';
<<<<<<< HEAD
import { LessThanOrEqual, MoreThanOrEqual, Repository, Not, In} from 'typeorm';
import { EstadoViaje } from './entities/estadoViaje.entity';
import { Viaje } from './entities/viaje.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom,lastValueFrom } from 'rxjs';
import { BASE_COORDS, TIEMPO_MUERTO } from '../constantesTiempoViaje';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { Observable } from 'rxjs';

=======
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { EstadoViaje } from './entities/estadoViaje.entity';
import { Viaje } from './entities/viaje.entity';
import { HttpService } from '@nestjs/axios';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { firstValueFrom } from 'rxjs';
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d

@Injectable()
export class ViajeService {

<<<<<<< HEAD
  constructor(
    @InjectRepository(EstadoViaje) private estadoViajeRepository: Repository<EstadoViaje>,
    @InjectRepository(Viaje) private viajeRepository: Repository<Viaje>,
    private readonly httpService: HttpService
  ) {}

  // 1. MÉTODO PARA EL MAIN.TS (Arregla el error de compilación)
  async testConnection() {
    try {
      const count = await this.viajeRepository.count();
      console.log('✅ DB connection works, Viaje count:', count);
    } catch (error) {
      console.error('❌ DB connection failed:', error);
    }
  }

  async createViaje(data: CreateViajeDto, user) {
    console.log('Creando viaje con datos:', data);
    
    // BLINDAJE: Buscamos el estado, pero si falla usamos ID 1 (PreCargado)
    let estadoDefault = await this.estadoViajeRepository.findOne({ where: { nombre: 'PreCargado' } });
    if (!estadoDefault) {
        estadoDefault = { id: 1 } as EstadoViaje;
    }

    const { fecha, hora } = await this.calcularFechaRegreso(data.origenCoords, data.destinoCoords, BASE_COORDS, data.fechaInicio, TIEMPO_MUERTO);
    
    const viaje = this.viajeRepository.create({
      fechaReserva: new Date(),
      fechaInicio: new Date(data.fechaInicio), 
      destinoInicio: data.destinoInicio,
      horaSalida: data.horaSalida.length === 5 ? `${data.horaSalida}:00` : data.horaSalida,
      fechaFin: fecha,
      horaLlegada: hora,
=======
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
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
      destinoFin: data.destinoFin,
      sena: 0,
      resto: 0,
      total: 0,
<<<<<<< HEAD
      estadoViaje: estadoDefault,
      distancia: data.distancia,
      usuarioId: user.id,
      CoordXOrigen: data.origenCoords.lat,
      CoordYOrigen: data.origenCoords.lng,
      CoordXDestino: data.destinoCoords.lat,
      CoordYDestino: data.destinoCoords.lng,
      unidades: []
    });
 
    const savedViaje = await this.viajeRepository.save(viaje);
    
    // Procesamiento de unidades
    if (data.unidades && data.unidades.length > 0) {
      for (const unidad of data.unidades) {
        const nuevaUnidad = await this.agregarUnidad(unidad, savedViaje.ViajeId);
        const subtotalCalculado = Math.trunc((nuevaUnidad.subtotal * data.distancia) * 100) / 100;
        
        savedViaje.unidades.push(nuevaUnidad.id);
        savedViaje.total += subtotalCalculado;
      }
    }

    savedViaje.sena = Math.trunc((savedViaje.total * 0.1) * 100) / 100;
    savedViaje.resto = Math.trunc((savedViaje.total - savedViaje.sena) * 100) / 100;
    
    await this.viajeRepository.save(savedViaje);

    // RETORNO CON RELACIÓN: Elimina el null en la respuesta inmediata
    return await this.viajeRepository.findOne({
      where: { ViajeId: savedViaje.ViajeId },
      relations: ['estadoViaje']
    });
  }

  async agregarUnidad(unidad: any, viajeId: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://unidad-service:3002/unidad', { ...unidad, viajeId })
      );
      return { id: response.data.UnidadId, subtotal: response.data.subtotal };
    } catch (error) {
      console.error('Error al crear la unidad:', error.message);
      return { id: null, subtotal: 0 };
    }
  }

  // 2. MÉTODO PARA EL CONTROLLER (Arregla el segundo error de compilación)
  async buscarUnidadesDisponibles(fechaInicio: Date, fechaFin: Date, camiones: any) {
=======
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

>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
    const viajesEnRango = await this.viajeRepository.find({
      where: [
        { fechaInicio: LessThanOrEqual(fechaFin), fechaFin: MoreThanOrEqual(fechaInicio) },
      ]
    });
<<<<<<< HEAD
    
    const unidadesOcupadas = viajesEnRango.flatMap(v => v.unidades || []);
    
    try {
      const dto = { unidadesOcupadas: unidadesOcupadas, camiones: camiones };
      const response = await firstValueFrom(
        this.httpService.post('http://unidad-service:3002/unidad/unidadesDisponibles', dto)
      );
      return response.data;
    } catch (error) {
      console.error('Error al buscar la unidad:', error.message);
      return [];
    }
  }

  async calcularFechaRegreso(origenCoords, destinoCoords, baseCoords, fechaInicio, tiempoMuerto): Promise<{ fecha: string; hora: string }> {
    const coords = `${baseCoords.lng},${baseCoords.lat};${origenCoords.lng},${origenCoords.lat};${destinoCoords.lng},${destinoCoords.lat};${baseCoords.lng},${baseCoords.lat}`;
    const url = `http://router.project-osrm.org/route/v1/driving/${coords}?overview=false`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const duracionTransitoSegundos = response.data.routes[0].duration;
      const tiempoTotalSegundos = duracionTransitoSegundos + (tiempoMuerto * 3600);
      const fechaCompleta = new Date(new Date(fechaInicio).getTime() + (tiempoTotalSegundos * 1000));
      
      return { 
        fecha: fechaCompleta.toISOString().split('T')[0], 
        hora: fechaCompleta.toTimeString().split(' ')[0] 
      };
    } catch (error) {
      console.error('Error calculando ruteo:', error);
      throw new Error('No se pudo calcular la fecha de regreso');
    }
  }

  async buscarTodos(user) {
    const viajes = this.viajeRepository.find(user.id);
    console.log(viajes);
    return viajes;
  }

  async consultarViajesCliente(user) {
    await this.verificarYCancelarVencidos(user.id);
    return await this.viajeRepository.find({
      where: { usuarioId: user.id },
      relations: ['estadoViaje'],
      order: { ViajeId: 'DESC' }
    });
  }

  async verificarYCancelarVencidos(userId: number) {
    const ahora = new Date();
    const limite48hs = new Date(ahora.getTime() + (48 * 60 * 60 * 1000));
    
    const viajesVencidos = await this.viajeRepository.find({
      where: {
        usuarioId: userId,
        estadoViaje: { id: 1 }, 
        fechaInicio: LessThanOrEqual(limite48hs)
      }
    });

    if (viajesVencidos.length > 0) {
      for (const v of viajesVencidos) {
        await this.viajeRepository.update(v.ViajeId, { estadoViaje: { id: 3 } });
      }
      console.log(`🚫 Sistema: Se cancelaron ${viajesVencidos.length} viajes.`);
    }
  }

  async confirmarPagoViaje(viajeId: number) {
    await this.viajeRepository.update(viajeId, { 
      estadoViaje: { id: 2 } 
    });
    
    console.log(`✅ Viaje ${viajeId} actualizado a estado: Confirmado`);
    return { success: true };
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
=======
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
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
    }

  }

<<<<<<< HEAD
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
=======
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d

  async findAll(): Promise<Viaje[]> {
    return await this.viajeRepository.find({
      relations: ['chofer', 'estadoViaje', 'unidad', 'transportista'],
    });
  }
  
  findOne(id: number) {
<<<<<<< HEAD
    return this.viajeRepository.findOne({ where: { ViajeId: id }, relations: ['estadoViaje'] });
  }

  remove(id: number) {
    return this.viajeRepository.delete(id);
  }

=======
    return `This action returns a #${id} viaje`;
  }

  /*
  update(id: number, updateViajeDto: UpdateViajeDto) {
    return `This action updates a #${id} viaje`;
  }*/

  remove(id: number) {
    return `This action removes a #${id} viaje`;
  }

//xddd

>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
  async enViaje(viajeId: number) {
    // El parámetro 'unidadId' parece ser el 'viajeId' según la lógica 
    // de los otros métodos ('finalizarViaje'); 

    // 1. Encontrar el estado "En Viaje"
    const estadoEnViaje = await this.estadoViajeRepository.findOne({
<<<<<<< HEAD
      where: { nombre: 'En viaje' }, // Asegúrate que este sea el nombre correcto en tu BD
=======
      where: { nombre: 'En Viaje' }, // Asegúrate que este sea el nombre correcto en tu BD
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
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
<<<<<<< HEAD
    try {
      const response = await firstValueFrom(
        this.httpService.patch(`http://unidad-service:3002/unidad/iniciarEstadoViaje/${viaje.ViajeId}`)
      );
      console.log('Respuesta de unidad-service:', response.data);
    }
    catch (error) {
      console.error('Error al actualizar el estado del viaje en unidad-service:', error.message);
    }
=======
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
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d

    return {
      mensaje: `El viaje ${viaje.ViajeId} ha comenzado.`,
      viaje,
    };
  }

  async finalizarViaje(viajeId: number) {
<<<<<<< HEAD
    //busca el estado Finalizado
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
        this.httpService.patch(`http://unidad-service:3002/unidad/finalizarEstadoViaje/${viaje.ViajeId}`)
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

  async cancelarViaje(viajeId: number) {
=======
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
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
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
<<<<<<< HEAD

    const viajeGuardado = await this.viajeRepository.save(viaje);
    //cambiar el estado de las unidades asociadas al viaje,usamos la misma funcion que en finalizar viaje
    try {
      const response = await firstValueFrom(
        this.httpService.patch(`http://unidad-service:3002/unidad/finalizarEstadoViaje/${viaje.ViajeId}`)
      );
      console.log('Respuesta de unidad-service:', response.data);
    }
    catch (error) {
      console.error('Error al actualizar el estado del viaje en unidad-service:', error.message);
    }
=======
    viaje.fechaFin = new Date();

    
    (viaje as any).motivoCancelacion = motivo ?? null;

    const viajeGuardado = await this.viajeRepository.save(viaje);

>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
    return {
      mensaje: `El viaje ${viajeGuardado.ViajeId} fue cancelado correctamente.`,
      viaje: viajeGuardado,
    };
  }
<<<<<<< HEAD

//Funcion para consultar el viaje por su id, para mostrarlo en el front
  async consultarViaje(viajeId: number) {
    const viaje = await this.viajeRepository.findOne({
      where: { ViajeId: viajeId },
      relations: ['chofer', 'estadoViaje', 'unidad', 'transportista'],
    });

    if (!viaje) {
      throw new NotFoundException(`No se encontró el viaje con id ${viajeId}`);
    }

    return viaje;
  }

async getViajesDelChofer(choferId:number) {
  try {
    console.log('Consultando unidades para el chofer con ID:', choferId);

    const response = await firstValueFrom(
      this.httpService.get('http://unidad-service:3002/unidad/por-chofer', {
        params: { choferId: choferId } // Asegúrate que tu authService inyecta el ID del chofer en el token y que el guard lo extrae correctamente
      })
    );

    const unidadesDelChofer = response.data; // Esto debería ser un array de objetos Unidad
    console.log('Unidades del chofer:', unidadesDelChofer);
    // Validación de seguridad: Si el chofer no tiene unidades/viajes asignados
    if (!unidadesDelChofer || unidadesDelChofer.length === 0) {
      return [];
    }

    // PASO 2: Extraer los IDs de los viajes
    // El microservicio de unidad nos devolvió algo como: [{ idViaje: 5, patente: '...', ... }, { idViaje: 8, ... }]
    const listaDeIdsDeViajes = unidadesDelChofer.map(u => u.idViaje);

    // PASO 3: Buscar los detalles de esos viajes en NUESTRA base de datos local
    const viajesEncontrados = await this.viajeRepository.find({
      where: {
        ViajeId: In(listaDeIdsDeViajes) // <--- MAGIA: Buscamos todos los viajes cuyo ID esté en la lista
      },
      relations: ['estadoViaje'], // Traemos el estado para pintar los botones en el front
      order: { fechaInicio: 'DESC' }
    });

    // PASO 4: Combinar (Merge) la información
    // Queremos devolver el Viaje + Los datos de la Unidad (Patente, modelo, etc) juntos.
    const viajesCompletos = viajesEncontrados.map(viaje => {
      // Buscamos la unidad correspondiente a este viaje específico en la respuesta del paso 1
      const unidadCorrespondiente = unidadesDelChofer.find(u => u.idViaje === viaje.ViajeId);

      return {
        ...viaje,
        unidadDetalle: unidadCorrespondiente // Aquí inyectamos los datos del camión/semi para el Front
      };
    });

    return viajesCompletos;

  } catch (error) {
    console.error('Error al obtener viajes del chofer:', error);
    return []; // Retornar vacío para no romper el front en caso de error de conexión
  }
}
=======
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
}