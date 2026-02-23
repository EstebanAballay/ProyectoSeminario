export declare class CreateViajeDto {
    fechaInicio: string;
    horaSalida: string;
    destinoInicio: string;
    destinoFin: string;
    fechaFin: string;
    horaLlegada: string;
    unidades: {
        semiremolqueId?: number;
        acopladoId?: number;
        tractoCamionId: number;
        tieneSemirremolque: boolean;
        tieneAcoplado: boolean;
    }[];
}
