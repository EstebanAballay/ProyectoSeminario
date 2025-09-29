import { ViajeService } from './viaje.service';
import { CreateViajeDto } from './dto/create-viaje.dto';
export declare class ViajeController {
    private readonly viajeService;
    constructor(viajeService: ViajeService);
    create(createViajeDto: CreateViajeDto): Promise<any>;
    findAll(): string;
    findOne(id: string): string;
    remove(id: string): string;
}
