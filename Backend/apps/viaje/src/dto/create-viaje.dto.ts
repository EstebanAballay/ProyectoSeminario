export class CreateViajeDto 
{
    fechaDeReserva: String; //el dia que se reservo
    fechaDeInicio: String;  //el dia que tiene que ir el camion
    fechaDeFin: number;     //el dia que el el camion llega a planta
    destinoInicio: number; //donde tiene que recoger la carga
    destinoFin: number;     //a donde lleva la acarga
    horaSalida: String;     //hora a la que sale
    horaLlegada:String      //hora a la que llega
}
