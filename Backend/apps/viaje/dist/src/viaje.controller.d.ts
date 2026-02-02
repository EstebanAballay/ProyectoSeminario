import { ViajeService } from './viaje.service';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { ConsultarUnidadesDto } from './dto/camiones.dto';
export declare class ViajeController {
    private readonly viajeService;
    constructor(viajeService: ViajeService);
    create(createViajeDto: CreateViajeDto, user: any): Promise<any>;
    findDisponibles(fechaInicio?: string, fechaFin?: string, camiones?: ConsultarUnidadesDto): Promise<any>;
    getMisViajes(req: any): Promise<import("./entities/viaje.entity").Viaje[]>;
    findOne(id: string): Promise<import("./entities/viaje.entity").Viaje>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
    confirmarPago(id: string): Promise<{
        success: boolean;
    }>;
}
