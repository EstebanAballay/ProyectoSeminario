import { CreateViajeDto } from './dto/create-viaje.dto';
import { Repository } from 'typeorm';
import { Viaje } from './entities/viaje.entity';
export declare class ViajeService {
    private readonly viajeRepo;
    constructor(viajeRepo: Repository<Viaje>);
    testConnection(): Promise<void>;
    create(createViajeDto: CreateViajeDto): string;
    findAll(): string;
    findOne(id: number): string;
    remove(id: number): string;
}
