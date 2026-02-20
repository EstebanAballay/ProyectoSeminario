import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { EstadoViaje } from './entities/estadoViaje.entity';
import { Viaje } from './entities/viaje.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BASE_COORDS, TIEMPO_MUERTO } from '../constantesTiempoViaje';
import { MailService } from './mail.service';

@Injectable()
export class ViajeService {

  constructor(
    @InjectRepository(EstadoViaje)
    private estadoViajeRepository: Repository<EstadoViaje>,

    @InjectRepository(Viaje)
    private viajeRepository: Repository<Viaje>,

    private readonly httpService: HttpService,

    private readonly mailService: MailService, // ✅ TU MailService
  ) {}

  async testConnection() {
    try {
      const count = await this.viajeRepository.count();
      console.log('✅ DB connection works, Viaje count:', count);
    } catch (error) {
      console.error('❌ DB connection failed:', error);
    }
  }

  // ===============================
  // CREAR VIAJE
  // ===============================

  async createViaje(data: CreateViajeDto, user) {

    let estadoDefault = await this.estadoViajeRepository.findOne({
      where: { nombre: 'PreCargado' }
    });

    if (!estadoDefault) {
      estadoDefault = { id: 1 } as EstadoViaje;
    }

    const { fecha, hora } = await this.calcularFechaRegreso(
      data.origenCoords,
      data.destinoCoords,
      BASE_COORDS,
      data.fechaInicio,
      TIEMPO_MUERTO
    );

    const viaje = this.viajeRepository.create({
      fechaReserva: new Date(),
      fechaInicio: new Date(data.fechaInicio),
      destinoInicio: data.destinoInicio,
      horaSalida: data.horaSalida.length === 5
        ? `${data.horaSalida}:00`
        : data.horaSalida,
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

    // --- Agregar unidades ---
    let totalAcumulado = 0;

// --- Agregar unidades ---
if (data.unidades && data.unidades.length > 0) {
  for (const unidad of data.unidades) {
    const nuevaUnidad = await this.agregarUnidad(unidad, savedViaje.ViajeId);

    const subtotalUnidad = Number(nuevaUnidad.subtotal);
    const distancia = Number(data.distancia);

    const subtotalCalculado =
      Math.trunc((subtotalUnidad * distancia) * 100) / 100;

    if (nuevaUnidad.id) {
      savedViaje.unidades.push(nuevaUnidad.id);
      totalAcumulado += subtotalCalculado;
    }
  }
}

// 🔹 Asignamos total ya calculado
savedViaje.total =
  Math.trunc(totalAcumulado * 100) / 100;

const totalNum = Number(savedViaje.total);

// --- Calcular señas ---
savedViaje.sena =
  Math.trunc((totalNum * 0.1) * 100) / 100;

savedViaje.resto =
  Math.trunc((totalNum - savedViaje.sena) * 100) / 100;

    // ✅ ENVÍO DE MAIL (NO BLOQUEANTE)
    this.mailService.enviarMailReserva(user.email, savedViaje)
      .catch(e => console.error('❌ Error mail reserva:', e));

    return await this.viajeRepository.findOne({
      where: { ViajeId: savedViaje.ViajeId },
      relations: ['estadoViaje']
    });
  }

  // ===============================
  // CAMBIOS DE ESTADO
  // ===============================

  async enViaje(id: number) {
    return await this.viajeRepository.update(id, {
      estadoViaje: { id: 4 }
    });
  }

  async finalizarViaje(id: number) {
    return await this.viajeRepository.update(id, {
      estadoViaje: { id: 5 }
    });
  }

  async confirmarPagoViaje(viajeId: number) {
    return await this.viajeRepository.update(viajeId, {
      estadoViaje: { id: 2 }
    });
  }

  async confirmarPagoViajeResto(id: number) {
    return await this.viajeRepository.update(id, {
      estadoViaje: { id: 2 }
    });
  }

  // ===============================
  // CANCELAR VIAJE
  // ===============================

  async cancelarViaje(viajeId: number, user: any) {

    const viaje = await this.viajeRepository.findOne({
      where: { ViajeId: viajeId },
      relations: ['estadoViaje']
    });

    if (!viaje) {
      throw new InternalServerErrorException('Viaje no encontrado');
    }

    await this.viajeRepository.update(viajeId, {
      estadoViaje: { id: 3 } // 3 = Cancelado
    });

    console.log(`🚫 Viaje ${viajeId} cancelado`);

    // ✅ ENVÍO DE MAIL CON TU SERVICIO REAL
    this.mailService.enviarMailCancelacion(
      user.email,
      viaje
    ).catch(e => console.error('❌ Error mail cancelación:', e));

    return { success: true };
  }

  // ===============================
  // UNIDADES
  // ===============================

  async agregarUnidad(unidad: any, viajeId: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'http://unidad-service:3002/unidad',
          { ...unidad, viajeId }
        )
      );

      return {
        id: response.data.UnidadId,
        subtotal: response.data.subtotal
      };

    } catch (e) {
      return { id: null, subtotal: 0 };
    }
  }

  async buscarUnidadesDisponibles(fechaInicio: Date, fechaFin: Date, camiones: any) {

    const viajesEnRango = await this.viajeRepository.find({
      where: [
        {
          fechaInicio: LessThanOrEqual(fechaFin),
          fechaFin: MoreThanOrEqual(fechaInicio)
        }
      ]
    });

    const ocupadas = viajesEnRango.flatMap(v => v.unidades || []);

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'http://unidad-service:3002/unidad/unidadesDisponibles',
          { unidadesOcupadas: ocupadas, camiones }
        )
      );

      return response.data;

    } catch (e) {
      return [];
    }
  }

  // ===============================
  // CÁLCULO DE FECHA
  // ===============================

  async calcularFechaRegreso(origen, destino, base, inicio, muerto)
    : Promise<{ fecha: string; hora: string }> {

    const coords =
      `${base.lng},${base.lat};${origen.lng},${origen.lat};${destino.lng},${destino.lat};${base.lng},${base.lat}`;

    const url =
      `http://router.project-osrm.org/route/v1/driving/${coords}?overview=false`;

    const resp = await firstValueFrom(this.httpService.get(url));

    const segundos =
      resp.data.routes[0].duration + (muerto * 3600);

    const fechaComp =
      new Date(new Date(inicio).getTime() + (segundos * 1000));

    return {
      fecha: fechaComp.toISOString().split('T')[0],
      hora: fechaComp.toTimeString().split(' ')[0]
    };
  }

  // ===============================
  // CONSULTAS
  // ===============================

  async findAll(user) {
    await this.verificarYCancelarVencidos(user.id);

    return await this.viajeRepository.find({
      where: { usuarioId: user.id },
      relations: ['estadoViaje'],
      order: { ViajeId: 'DESC' }
    });
  }

  async verificarYCancelarVencidos(userId: number) {

    const limite =
      new Date(new Date().getTime() + (48 * 60 * 60 * 1000));

    const vencidos = await this.viajeRepository.find({
      where: {
        usuarioId: userId,
        estadoViaje: { id: 1 },
        fechaInicio: LessThanOrEqual(limite)
      }
    });

    for (const v of vencidos) {
      await this.viajeRepository.update(
        v.ViajeId,
        { estadoViaje: { id: 3 } }
      );
    }
  }

  findOne(id: number) {
    return this.viajeRepository.findOne({
      where: { ViajeId: id },
      relations: ['estadoViaje']
    });
  }

  remove(id: number) {
    return this.viajeRepository.delete(id);
  }
}