import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
import { HttpService } from '@nestjs/axios';
import { Semirremolque } from './entities/semirremolque.entity';
import { Acoplado } from './entities/acoplado.entity';
import { Repository } from 'typeorm';
import { Tipo } from './entities/tipo.entity';
import { TipoCamion } from './entities/tipoCamion.entity';
import { Camion } from './entities/camion.entity';
import { Unidad } from './entities/unidad.entity';
export declare class UnidadService {
    private readonly httpService;
    private semirremolqueRepository;
    private acopladoRepository;
    private tipoRepository;
    private tipoCamionRepository;
    private CamionRepository;
    private UnidadRepository;
    constructor(httpService: HttpService, semirremolqueRepository: Repository<Semirremolque>, acopladoRepository: Repository<Acoplado>, tipoRepository: Repository<Tipo>, tipoCamionRepository: Repository<TipoCamion>, CamionRepository: Repository<Camion>, UnidadRepository: Repository<Unidad>);
    testConnection(): Promise<void>;
    private getRandomItem;
    createUnidad(createUnidadDto: CreateUnidadDto): Promise<Unidad>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateUnidadDto: UpdateUnidadDto): string;
    remove(id: number): string;
}
