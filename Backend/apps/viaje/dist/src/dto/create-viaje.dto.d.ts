export declare class CreateViajeDto {
    fechaInicio: string;
    destinoInicio: string;
    destinoFin: string;
    horaSalida: string;
    horaLlegada: string;
    fechaFin: string;
    unidades: {
        camionId: string;
        transportistaId: number;
        semiremolqueId?: string;
        acopladoId?: string;
        tipo: string;
    }[];
}
