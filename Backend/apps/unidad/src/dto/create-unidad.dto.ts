export class CreateUnidadDto{
    viajeId:number;
    idCamion:number;
    semiremolque:boolean;
    acoplado:boolean;
    tipoCamion: string;         //tractocamion o entero
    tipoSemirremolque?:string;
    tipoAcoplado?:string;
}


