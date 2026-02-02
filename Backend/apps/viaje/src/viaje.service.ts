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
      destinoFin: data.destinoFin,
      sena: 0,
      resto: 0,
      total: 0,
      estadoViaje: estadoDefault,
      distancia: data.distancia,
      usuarioId: user.id,
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
    const viajesEnRango = await this.viajeRepository.find({
      where: [
        { fechaInicio: LessThanOrEqual(fechaFin), fechaFin: MoreThanOrEqual(fechaInicio) },
      ]
    });
    
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

  async findAll(user) {
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

  findOne(id: number) {
    return this.viajeRepository.findOne({ where: { ViajeId: id }, relations: ['estadoViaje'] });
  }

  remove(id: number) {
    return this.viajeRepository.delete(id);
  }
}