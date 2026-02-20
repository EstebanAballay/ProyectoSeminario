import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, Req } from '@nestjs/common';
import { ViajeService } from './viaje.service';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { ConsultarUnidadesDto } from './dto/camiones.dto';
import { GetUser } from '../decorators/get-user.decorator';
import { AuthGuard } from '../viajeAuth/auth.guard';

@Controller('viaje')
export class ViajeController {
  constructor(private readonly viajeService: ViajeService) {}

  @Post('nuevoViaje')
  @UseGuards(AuthGuard)
  create(@Body() createViajeDto: CreateViajeDto, @GetUser() user: any): Promise<any> {
    return this.viajeService.createViaje(createViajeDto, user);
  }

  @Post('viajesRango')
  findDisponibles(
    @Query('fechaInicio') fechaInicio?: string, 
    @Query('fechaFin') fechaFin?: string,
    @Body() dto?: ConsultarUnidadesDto
  ) {
    const inicio = fechaInicio ? new Date(fechaInicio) : undefined;
    const fin = fechaFin ? new Date(fechaFin) : undefined;
    // Pasamos solo el array de camiones que espera el service
    return this.viajeService.buscarUnidadesDisponibles(inicio, fin, dto?.camiones || []);
  }

  @Get('misViajes')
  @UseGuards(AuthGuard)
  async getMisViajes(@Request() req) {
    return await this.viajeService.findAll(req.user); 
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.viajeService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viajeService.remove(+id);
  }

  @Patch(':id/confirmar-pago')
  async confirmarPago(@Param('id') id: string) {
    return this.viajeService.confirmarPagoViaje(+id);
  }
  @Patch(':id/cancelar')
  @UseGuards(AuthGuard)
  cancelar(
    @Param('id') id: number,
    @Req() req
  ) {
    return this.viajeService.cancelarViaje(id, req.user);
  }
 
}