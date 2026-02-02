import { Controller, Post, Param, Body, Get, ParseIntPipe } from '@nestjs/common';
import { CobroService } from './cobro.service';

@Controller('cobros') // Esta es la base: http://localhost:3001/cobros
export class CobroController {
    constructor(private readonly cobroService: CobroService) {}

    // 1. CREAR COBRO: POST http://localhost:3001/cobros
    @Post('viajeId/:viajeId')
    async crearCobro(@Param('viajeId', ParseIntPipe) viajeId: number) {
        return await this.cobroService.crearCobro(viajeId);
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