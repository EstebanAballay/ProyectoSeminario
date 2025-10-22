import { UnidadService } from './unidad.service';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
export declare class UnidadController {
    private readonly unidadService;
    constructor(unidadService: UnidadService);
    create(createUnidadDto: CreateUnidadDto): Promise<any>;
    consultarTiposAcoplados(): Promise<string[]>;
    consultarTiposCamiones(): Promise<string[]>;
    findOne(id: string): string;
    update(id: string, updateUnidadDto: UpdateUnidadDto): string;
    remove(id: string): string;
}
