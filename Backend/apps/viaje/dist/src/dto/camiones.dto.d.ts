declare class CamionTipoDto {
    tipo: string;
    semirremolque: string;
    acoplado: string;
}
export declare class ConsultarUnidadesDto {
    camiones: CamionTipoDto[];
    origenCoords: any;
    destinoCoords: any;
}
export {};
