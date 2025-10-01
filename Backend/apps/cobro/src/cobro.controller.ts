import { Controller, Get } from '@nestjs/common';
import { CobroService } from './cobro.service';

@Controller('cobro')
export class CobroController {
    constructor(private readonly cobroService: CobroService) {}

    @Get()
    findAll() {return this.cobroService.findAll();}


}
