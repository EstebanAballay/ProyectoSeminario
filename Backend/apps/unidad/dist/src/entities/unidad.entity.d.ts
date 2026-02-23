import { Camion } from './camion.entity';
import { Semirremolque } from './semirremolque.entity';
import { Acoplado } from './acoplado.entity';
import { Transportista } from './transportista.entity';
export declare class Unidad {
    UnidadId: number;
    idViaje: number;
    camion: Camion;
    semiremolque?: Semirremolque;
    acoplado?: Acoplado;
    transportistaId: number;
    transportista: Transportista;
    subtotal: number;
}
