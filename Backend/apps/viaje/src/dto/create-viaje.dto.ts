export class CreateViajeDto 
{   
<<<<<<< HEAD
  fechaInicio: string;  //el dia que tiene que ir el camion
  horaSalida: string;     //hora a la que sale
  destinoInicio: string; //donde tiene que recoger la carga

  destinoFin: string;     //a donde lleva la acarga
  fechaFin:string;
  tiempoDeViaje:string;

  distancia:number;
  //unidades
  unidades: {
    semiremolqueId?:number;   
    acopladoId?:number;
    tractoCamionId:number
    tieneSemirremolque:boolean;
    tieneAcoplado:boolean;
  }[];

  origenCoords: { lat: number; lng: number };
  destinoCoords: { lat: number; lng: number };
=======
    fechaInicio: string;  //el dia que tiene que ir el camion
    horaSalida: string;     //hora a la que sale
    destinoInicio: string; //donde tiene que recoger la carga

    destinoFin: string;     //a donde lleva la acarga
    fechaFin:string;
    horaLlegada:string;

    //unidades
    unidades: {
      semiremolqueId?:number;   
      acopladoId?:number;
      tractoCamionId:number
      tieneSemirremolque:boolean;
      tieneAcoplado:boolean;
  }[];
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
}

