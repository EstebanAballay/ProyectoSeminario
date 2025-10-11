export class CreateUnidadDto{
    viajeId:number;
    semiremolque:boolean;   
    acoplado:boolean;
    tipoCamion: string;         //tractocamion,cisterna,reparto,frigorifico.
    tipoSemirremolque?:string;
    tipoAcoplado?:string;
}


