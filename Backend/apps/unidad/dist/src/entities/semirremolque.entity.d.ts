import { EstadoSemirremolque } from './estadoSemirremolque.entity';
import { Tipo } from './tipo.entity';
export declare class Semirremolque {
    id: number;
    cantidadDeEjes: number;
    patente: string;
    capacidad: number;
    precio: number;
    estado: EstadoSemirremolque;
    tipo: Tipo;
}
