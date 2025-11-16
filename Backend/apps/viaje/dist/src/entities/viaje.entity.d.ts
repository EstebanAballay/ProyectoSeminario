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
    sena?: number;
    resto?: number;
    total?: number;
    distancia?: number;
    unidades?: number[];
    estadoViaje: EstadoViaje;
}
