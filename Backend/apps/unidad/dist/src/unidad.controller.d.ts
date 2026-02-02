import { UnidadService } from './unidad.service';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
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
    buscarUnidades(idViaje?: number): Promise<string | import("./entities/unidad.entity").Unidad[]>;
    asignarChoferes(dto: {
        asignaciones: {
            unidadId: number;
            choferId: number;
        }[];
    }): Promise<void>;
    update(id: string, updateUnidadDto: UpdateUnidadDto): string;
    remove(id: string): string;
    crearUnidad(createUnidadDto: CreateVehicleDto): Promise<import("./entities/camion.entity").Camion | import("./entities/acoplado.entity").Acoplado | import("./entities/semirremolque.entity").Semirremolque>;
}
