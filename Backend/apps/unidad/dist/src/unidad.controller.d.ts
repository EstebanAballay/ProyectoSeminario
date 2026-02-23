import { UnidadService } from './unidad.service';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
import { ConsultarUnidadesDto } from './dto/datosUnidadesFront.dto';
export declare class UnidadController {
    private readonly unidadService;
    constructor(unidadService: UnidadService);
    create(createUnidadDto: CreateUnidadDto): Promise<any>;
    finndAll(): any;
    findAll(id: String): Promise<any>;
    consultarTiposAcoplados(): Promise<import("./entities/tipo.entity").Tipo[]>;
    consultarTiposCamiones(): Promise<import("./entities/tipoCamion.entity").TipoCamion[]>;
    consultarUnidadesDisponibles(dto?: ConsultarUnidadesDto): Promise<{
        unidadesFormadas: any[];
        errores: string[];
    }>;
    iniciarEstadoViaje(id: number): Promise<void>;
    finalizarEstadoViaje(id: number): Promise<void>;
    findOne(id: string): string;
    update(id: string, updateUnidadDto: UpdateUnidadDto): string;
    remove(id: string): string;
}
