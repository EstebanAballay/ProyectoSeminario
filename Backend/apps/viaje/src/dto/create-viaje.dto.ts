export class CreateViajeDto 
{
    fechaInicio: String;  //el dia que tiene que ir el camion
    destinoInicio: number; //donde tiene que recoger la carga
    destinoFin: number;     //a donde lleva la acarga
    horaSalida: String;     //hora a la que sale

    //unidadesg
    unidades: {
        camionId: string;
        transportistaId: number;
        semiremolqueId?: string;
        acopladoId?: string;
        tipo: string; // mixto, frigorífico, etc.
        //subtotal se calcula en el back, en unidad.service
  }[];
}

