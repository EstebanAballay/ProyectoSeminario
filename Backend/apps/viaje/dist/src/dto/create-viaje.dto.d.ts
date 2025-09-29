export declare class CreateViajeDto {
    fechaInicio: String;
    destinoInicio: number;
    destinoFin: number;
    horaSalida: String;
    unidades: {
        camionId: string;
        transportistaId: number;
        semiremolqueId?: string;
        acopladoId?: string;
        tipo: string;
    }[];
}
