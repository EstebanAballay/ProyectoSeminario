import { CobroService } from './cobro.service';
export declare class CobroController {
    private readonly cobroService;
    constructor(cobroService: CobroService);
    findAll(): Promise<string>;
}
