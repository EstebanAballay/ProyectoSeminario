import { UnidadService } from './unidad.service';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { ConsultarUnidadesDto } from './dto/datosUnidadesFront.dto';
import { CreateVehicleDto } from './dto/create-Vehicle.dto';
export declare class UnidadController {
    private readonly unidadService;
    constructor(unidadService: UnidadService);
    create(createUnidadDto: CreateUnidadDto): Promise<any>;
    consultarTiposAcoplados(): Promise<import("./entities/tipo.entity").Tipo[]>;
    consultarTiposCamiones(): Promise<import("./entities/tipoCamion.entity").TipoCamion[]>;
    consultarUnidadesDisponibles(dto?: ConsultarUnidadesDto): Promise<{
        unidadesFormadas: any[];
        errores: string[];
    }>;
    getChoferesDisponibles(dto: {
        idViajesEnRango: number[];
    }): Promise<any>;
    asignarChoferes(dto: {
        asignaciones: {
            unidadId: number;
            choferId: number;
        }[];
    }): Promise<void>;
    iniciarEstadoViaje(id: number): Promise<void>;
    finalizarEstadoViaje(id: number): Promise<void>;
    crearUnidad(createUnidadDto: CreateVehicleDto): Promise<import("./entities/camion.entity").Camion | import("./entities/semirremolque.entity").Semirremolque | import("./entities/acoplado.entity").Acoplado>;
    findAll(id: String): Promise<any>;
    findOne(id: string): Promise<import("./entities/unidad.entity").Unidad[]>;
    buscarUnidades(idViaje?: number): Promise<import("./entities/unidad.entity").Unidad[]>;
}
