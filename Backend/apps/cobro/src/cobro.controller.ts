import { Controller, Post, Param, Body, Get, ParseIntPipe } from '@nestjs/common';
import { CobroService } from './cobro.service';
import { Cobro } from './entities/cobro.entity';

@Controller('cobros') // Esta es la base: http://localhost:3001/cobros
export class CobroController {
    constructor(private readonly cobroService: CobroService) {}

    // 1. CREAR COBRO: POST http://localhost:3001/cobros
    @Post()
    async crearCobro(@Body() cobroData: Partial<Cobro>) {
        return await this.cobroService.crearCobro(cobroData);
    }

    // 2. CONSULTAR: GET http://localhost:3001/cobros/25
    @Get(':id')
    async obtenerEstado(@Param('id', ParseIntPipe) id: number) {
        return await this.cobroService.obtenerPorId(id);
    }

    // 3. PAGAR: POST http://localhost:3001/cobros/25/pagar
    @Post(':id/pagar')
    async pagar(@Param('id', ParseIntPipe) id: number) {
        return await this.cobroService.generarPagoMP(id);
    }
}