export class CreateViajeDto 
{
    fechaInicio: string;  //el dia que tiene que ir el camion
    destinoInicio: string; //donde tiene que recoger la carga
    destinoFin: string;     //a donde lleva la acarga
    horaSalida: string;     //hora a la que sale
    horaLlegada:string;
    fechaFin:string;

    //unidades
    unidades: {
      semiremolque:boolean;   
      acoplado:boolean;
      tipoCamion: string;         //tractocamion,cisterna,reparto,frigorifico.
      tipoSemirremolque?:string;
      tipoAcoplado?:string;
  }[];
}

