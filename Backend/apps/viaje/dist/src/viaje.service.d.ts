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
    findAll(user: any): Promise<Viaje[]>;
    verificarYCancelarVencidos(userId: number): Promise<void>;
    confirmarPagoViaje(viajeId: number): Promise<{
        success: boolean;
    }>;
    findOne(id: number): Promise<Viaje>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
