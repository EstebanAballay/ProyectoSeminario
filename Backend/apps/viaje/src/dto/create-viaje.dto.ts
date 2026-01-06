export class CreateViajeDto 
{   
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
}

