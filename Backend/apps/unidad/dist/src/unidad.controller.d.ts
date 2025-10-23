import { UnidadService } from './unidad.service';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
export declare class UnidadController {
    private readonly unidadService;
    constructor(unidadService: UnidadService);
    create(createUnidadDto: CreateUnidadDto): Promise<any>;
    consultarTiposAcoplados(): Promise<import("./entities/tipo.entity").Tipo[]>;
    consultarTiposCamiones(): Promise<import("./entities/tipoCamion.entity").TipoCamion[]>;
    consultarUnidadesDisponibles(unidadesOcupadas: number[]): Promise<{
        camiones: import("./entities/camion.entity").Camion[];
        acoplados: import("./entities/acoplado.entity").Acoplado[];
        semirremolques: import("./entities/semirremolque.entity").Semirremolque[];
    }>;
    findOne(id: string): string;
    update(id: string, updateUnidadDto: UpdateUnidadDto): string;
    remove(id: string): string;
}
