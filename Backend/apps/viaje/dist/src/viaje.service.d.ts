import { CreateViajeDto } from './dto/create-viaje.dto';
import { Repository } from 'typeorm';
import { EstadoViaje } from './entities/estadoViaje.entity';
import { Viaje } from './entities/viaje.entity';
import { HttpService } from '@nestjs/axios';
export declare class ViajeService {
    private estadoViajeRepository;
    private viajeRepository;
    private readonly httpService;
    constructor(estadoViajeRepository: Repository<EstadoViaje>, viajeRepository: Repository<Viaje>, httpService: HttpService);
    testConnection(): Promise<void>;
    createViaje(data: CreateViajeDto, user: any): Promise<Viaje>;
    agregarUnidad(unidad: any, viajeId: number): Promise<{
        id: any;
        subtotal: any;
    }>;
    buscarUnidadesDisponibles(fechaInicio: Date, fechaFin: Date, camiones: any): Promise<any>;
    calcularFechaRegreso(origenCoords: any, destinoCoords: any, baseCoords: any, fechaInicio: any, tiempoMuerto: any): Promise<{
        fecha: string;
        hora: string;
    }>;
    buscarTodos(user: any): Promise<Viaje[]>;
    getViajesPendientes(): Promise<{
        unidades: any;
        ViajeId: number;
        fechaReserva: Date;
        fechaInicio: Date;
        fechaFin?: Date;
        destinoInicio: string;
        destinoFin: string;
        horaSalida: string;
        horaLlegada?: string;
        sena?: number;
        resto?: number;
        total?: number;
        distancia: number;
        estadoViaje: EstadoViaje;
        usuarioId: number;
        CoordXOrigen: number;
        CoordYOrigen: number;
        CoordXDestino: number;
        CoordYDestino: number;
    }[]>;
    getChoferesDisponibles(fechaInicio: Date, fechaFin: Date): Promise<any>;
    asignarChoferes(viajeId: number, asignaciones: {
        unidadId: number;
        choferId: number;
    }[]): Promise<void>;
    rechazarViaje(viajeId: number): Promise<void>;
    findAll(): Promise<Viaje[]>;
    findOne(id: number): Promise<Viaje>;
    remove(id: number): string;
    enViaje(viajeId: number): Promise<{
        mensaje: string;
        viaje: Viaje;
    }>;
    finalizarViaje(viajeId: number): Promise<{
        mensaje: string;
        viaje: Viaje;
    }>;
    cancelarViaje(viajeId: number): Promise<{
        mensaje: string;
        viaje: Viaje;
    }>;
}
