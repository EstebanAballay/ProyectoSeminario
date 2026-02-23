import { Controller, Post, Param, Body, Get, ParseIntPipe,UseGuards,Request,Res } from '@nestjs/common';
import { CobroService } from './cobro.service';
import {CreateCobroDto} from './entities/create-cobro-dto';
import { AuthGuard } from './cobroAuth/auth.guard';
import { Response } from 'express';

@Controller('cobros') // Esta es la base: http://localhost:3001/cobros
export class CobroController {
    constructor(private readonly cobroService: CobroService) {}
    
    /* El front el ordena a este servicio crear el cobro,luego le ordena generar el link de pago,
    y cuando el cliente paga hay un webhook(puerto que conecta nuestro localhost con internet) que esta
    escuchando la notificacion de mp,es notificacion contiene el id de la transaccion de mp,es en ese momento que llama
    a verificar y confirmar pago, y si es positiva, ordena cambiar el estado del cobro y el viaje.
    */ 
   
    @Get('/consultar-cobros-usuario')
    @UseGuards(AuthGuard)
    async consultarCobrosUsuario(@Request() req):Promise<any> {
        return await this.cobroService.consultarCobrosUsuario(req.user);
    }

    // 1. CREAR COBRO: POST http://localhost:3001/cobros
    @Post('')
    async crearCobro(@Body() createCobroDto: CreateCobroDto) {
        console.log(createCobroDto);
        return await this.cobroService.crearCobro(createCobroDto);
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

    @Get(':id/factura')
    async descargarFactura(@Param('id') id: string, @Res() res: Response) {
        return this.cobroService.descargarFacturaCobro(+id,res);
    }    

} 