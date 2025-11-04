declare class CamionTipoDto {
    tipo: string;
    semirremolque: string;
    acoplado: string;
}
export declare class ConsultarUnidadesDto {
    unidadesOcupadas?: number[];
    camiones?: CamionTipoDto[];
}
export {};
