import { estadoTransportista } from './estadoTransportista.entity';
import { Especializacion } from './especializacion.entity';
export declare class Transportista {
    idUsuario: number;
    legajo: string;
    estado: estadoTransportista;
    especializacion: Especializacion;
}
