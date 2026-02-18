export declare class CreateViajeDto {
    fechaInicio: string;
    horaSalida: string;
    destinoInicio: string;
    destinoFin: string;
    fechaFin: string;
    tiempoDeViaje: string;
    distancia: number;
    unidades: {
        semiremolqueId?: number;
        acopladoId?: number;
        tractoCamionId: number;
        tieneSemirremolque: boolean;
        tieneAcoplado: boolean;
    }[];
    origenCoords: {
        lat: number;
        lng: number;
    };
    destinoCoords: {
        lat: number;
        lng: number;
    };
}
