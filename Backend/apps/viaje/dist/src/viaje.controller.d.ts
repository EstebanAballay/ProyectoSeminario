import { ViajeService } from './viaje.service';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { ConsultarUnidadesDto } from './dto/camiones.dto';
export declare class ViajeController {
    private readonly viajeService;
    constructor(viajeService: ViajeService);
    create(createViajeDto: CreateViajeDto, user: any): Promise<any>;
    findDisponibles(fechaInicio?: string, dtoViaje?: ConsultarUnidadesDto): Promise<any>;
    findAll(user: any): Promise<import("./entities/viaje.entity").Viaje[]>;
    getMisViajes(req: any): Promise<import("./entities/viaje.entity").Viaje[]>;
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
        sena: number;
        resto: number;
        total: number;
        distancia: number;
        estadoViajeId: number;
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
    getViajesPorPagar(user: any): Promise<{
        unidades: any;
        ViajeId: number;
        fechaReserva: Date;
        fechaInicio: Date;
        fechaFin?: Date;
        destinoInicio: string;
        destinoFin: string;
        horaSalida: string;
        horaLlegada?: string;
        sena: number;
        resto: number;
        total: number;
        distancia: number;
        estadoViajeId: number;
        estadoViaje: import("./entities/estadoViaje.entity").EstadoViaje;
        usuarioId: number;
        CoordXOrigen: number;
        CoordYOrigen: number;
        CoordXDestino: number;
        CoordYDestino: number;
    }[]>;
    obtenerViajesPorIds(idsString: string): Promise<import("./entities/viaje.entity").Viaje[]>;
    rechazarViaje(id: number): Promise<void>;
    findOne(id: number): Promise<import("./entities/viaje.entity").Viaje>;
    findViajeXUnidad(id: number): Promise<import("./entities/viaje.entity").Viaje>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
    finalizar(id: number): Promise<{
        mensaje: string;
        viaje: import("./entities/viaje.entity").Viaje;
    }>;
    iniciar(id: number): Promise<{
        mensaje: string;
        viaje: import("./entities/viaje.entity").Viaje;
    }>;
    cancelar(id: number): Promise<{
        mensaje: string;
        viaje: import("./entities/viaje.entity").Viaje;
    }>;
    confirmarPagoSenia(id: string): Promise<{
        success: boolean;
    }>;
    confirmarPagResto(id: string): Promise<{
        success: boolean;
    }>;
}
