import { EstadoAcoplado } from './estadoAcoplado.entity';
import { Tipo } from './tipo.entity';
export declare class Acoplado {
    id: number;
    patente: string;
    capacidad: number;
    precio: number;
    cantidadDeEjes: number;
    estado: EstadoAcoplado;
    tipo: Tipo;
}
