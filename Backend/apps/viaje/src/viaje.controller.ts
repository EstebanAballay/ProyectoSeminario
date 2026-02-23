import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, Req, BadRequestException } from '@nestjs/common';
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
    return await this.viajeService.consultarViajesCliente(req.user); 
  }

  //consulta de los viajes del admin pendientes
  @Get('viajesPendientes')
  @UseGuards(AuthGuard)
  findAllAdmin() {
    return this.viajeService.getViajesPendientes();
  }

  @Get('choferesDisponibles')
  async getChoferesDisponibles( 
    @Query('desde') desde: Date,
    @Query('hasta') hasta: Date) { 
      if (!desde || !hasta) {
        throw new BadRequestException('Las fechas "desde" y "hasta" son obligatorias')};
        const fechaInicio = new Date(desde);
        const fechaFin = new Date(hasta);
        return this.viajeService.getChoferesDisponibles(fechaInicio, fechaFin);
      }

  //Actualizo con un post porque le envio un dto
  @Post('asignarChoferes')
  async asignarChoferes(@Body() dto: {viajeId: number, asignaciones: {unidadId: number, choferId: number}[]}) {
    return this.viajeService.asignarChoferes(dto.viajeId, dto.asignaciones);
  }

  @Get('viajesPorPagar')
  @UseGuards(AuthGuard)
  async getViajesPorPagar(@GetUser() user: any) {
    return await this.viajeService.getViajesPendientesPago(user);
  }

  @Get('por-ids')
  async obtenerViajesPorIds(@Query('ids') idsString: string) {
    // 1. Si no mandan ningún ID, devolvemos un array vacío para no romper nada
    if (!idsString) {
      return [];
    }

    // 2. Transformamos el string "1,2,3" en un array de números [1, 2, 3]
    const idsArray = idsString
      .split(',')
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id)); // Filtramos por si se coló algún valor no numérico

    // 3. Delegamos la búsqueda al servicio
    return this.viajeService.buscarPorMultiplesIds(idsArray);
  }

  @Patch('rechazarViaje/:id')
  async rechazarViaje(@Param('id') id: number) {
    return this.viajeService.rechazarViaje(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.viajeService.findOne(+id);
  }

  @Get('/viaje-con-unidades/:id')
  findViajeXUnidad(@Param('id') id: number) {
    return this.viajeService.findViajeXUnidad(id);
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
  cancelar(@Param('id') id: number,@Req() req) {
    return this.viajeService.cancelarViaje(id, req.user);
  }
  
}