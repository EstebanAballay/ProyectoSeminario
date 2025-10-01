import { Camion } from './camion.entity';
import { Semirremolque } from './semirremolque.entity';
import { Acoplado } from './acoplado.entity';
import { Transportista } from './transportista.entity';
export declare class Unidad {
    UnidadId: number;
    idViaje: number;
    Camion: Camion;
    semiremolque?: Semirremolque;
    acoplado?: Acoplado;
    transportista: Transportista;
    subtotal: number;
}
