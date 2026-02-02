import { ViajeService } from './viaje.service';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { ConsultarUnidadesDto } from './dto/camiones.dto';
export declare class ViajeController {
    private readonly viajeService;
    constructor(viajeService: ViajeService);
    create(createViajeDto: CreateViajeDto, user: any): Promise<any>;
    findDisponibles(fechaInicio?: string, fechaFin?: string, camiones?: ConsultarUnidadesDto): Promise<any>;
    findAll(user: any): Promise<import("./entities/viaje.entity").Viaje[]>;
    findAllAdmin(): Promise<{
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
        estadoViaje: import("./entities/estadoViaje.entity").EstadoViaje;
        usuarioId: number;
        CoordXOrigen: number;
        CoordYOrigen: number;
        CoordXDestino: number;
        CoordYDestino: number;
    }[]>;
    getChoferesDisponibles(desde: Date, hasta: Date): Promise<any>;
    asignarChoferes(dto: {
        viajeId: number;
        asignaciones: {
            unidadId: number;
            choferId: number;
        }[];
    }): Promise<void>;
    rechazarViaje(id: number): Promise<void>;
    findOne(id: string): Promise<import("./entities/viaje.entity").Viaje>;
    remove(id: string): string;
    finalizar(id: number): Promise<{
        mensaje: string;
        viaje: import("./entities/viaje.entity").Viaje;
    }>;
    iniciar(id: number): Promise<{
        mensaje: string;
        viaje: import("./entities/viaje.entity").Viaje;
    }>;
}
