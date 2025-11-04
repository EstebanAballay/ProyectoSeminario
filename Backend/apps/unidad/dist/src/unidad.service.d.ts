import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
import { Unidad } from './entities/unidad.entity';
import { Repository } from 'typeorm';
export declare class UnidadService {
    private readonly unidadRepo;
    constructor(unidadRepo: Repository<Unidad>);
    testConnection(): Promise<void>;
    create(createUnidadDto: CreateUnidadDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateUnidadDto: UpdateUnidadDto): string;
    remove(id: number): string;
}
