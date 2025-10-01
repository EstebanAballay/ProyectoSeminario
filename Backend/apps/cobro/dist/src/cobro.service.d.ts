import { Repository } from 'typeorm';
import { Cobro } from './Entities/cobro.entity';
export declare class CobroService {
    private readonly cobroRepo;
    constructor(cobroRepo: Repository<Cobro>);
    testConnection(): Promise<void>;
    findAll(): Promise<string>;
}
