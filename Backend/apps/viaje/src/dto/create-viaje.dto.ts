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
        camionId: string;
        transportistaId: number;
        semiremolqueId?: string;
        acopladoId?: string;
        tipo: string; // mixto, frigorífico, etc.
        //subtotal se calcula en el back, en unidad.service
  }[];
}

