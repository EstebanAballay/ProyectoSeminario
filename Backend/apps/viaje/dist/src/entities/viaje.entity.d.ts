import { EstadoViaje } from './estadoViaje.entity';
export declare class Viaje {
    ViajeId: number;
    fechaReserva: Date;
    fechaInicio: Date;
    fechaFin?: Date;
    destinoInicio: string;
    destinoFin: string;
    horaSalida: string;
    horaLlegada?: string;
    seña?: number;
    resto?: number;
    total?: number;
    idUnidades: number[];
    estadoViaje: EstadoViaje;
}
