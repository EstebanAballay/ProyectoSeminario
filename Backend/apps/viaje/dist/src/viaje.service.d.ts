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
    createViaje(data: CreateViajeDto): Promise<Viaje>;
    agregarUnidad(unidad: any, viajeId: number): Promise<any>;
    buscarUnidadesDisponibles(fechaInicio: Date, fechaFin: Date): Promise<any>;
    findAll(): string;
    findOne(id: number): string;
    remove(id: number): string;
}
