import { EstadoCamion } from './estadoCamion.entity';
import { TipoCamion } from './tipoCamion.entity';
export declare class Camion {
    id: number;
    EstadoCamion: EstadoCamion;
    patente: string;
    tipoCamion: TipoCamion;
    precio: number;
    peso: number;
    cantidadEjes: number;
}
