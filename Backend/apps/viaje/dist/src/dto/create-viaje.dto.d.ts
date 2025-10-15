export declare class CreateViajeDto {
    fechaInicio: string;
    destinoInicio: string;
    destinoFin: string;
    horaSalida: string;
    horaLlegada: string;
    fechaFin: string;
    unidades: {
        semiremolque: boolean;
        acoplado: boolean;
        tipoCamion: string;
        tipoSemirremolque?: string;
        tipoAcoplado?: string;
    }[];
}
