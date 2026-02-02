import { ViajeService } from './viaje.service';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { ConsultarUnidadesDto } from './dto/camiones.dto';
export declare class ViajeController {
    private readonly viajeService;
    constructor(viajeService: ViajeService);
    create(createViajeDto: CreateViajeDto): Promise<any>;
    findDisponibles(fechaInicio?: string, fechaFin?: string, camiones?: ConsultarUnidadesDto): Promise<any>;
    findAll(): Promise<import("./entities/viaje.entity").Viaje[]>;
    findOne(id: string): string;
    remove(id: string): string;
    finalizar(id: number): Promise<{
        mensaje: string;
        viaje: import("./entities/viaje.entity").Viaje;
    }>;
}
