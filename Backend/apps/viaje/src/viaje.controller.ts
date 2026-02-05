import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, BadRequestException,Request } from '@nestjs/common';
import { ViajeService } from './viaje.service';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { ConsultarUnidadesDto } from './dto/camiones.dto';
import { GetUser } from '../decorators/get-user.decorator';
import { AuthGuard } from '../viajeAuth/auth.guard';

@Controller('viaje')
export class ViajeController {
  constructor(private readonly viajeService: ViajeService) {}
  //  viaje/nuevoViaje
  //crear
  @Post('nuevoViaje')
  @UseGuards(AuthGuard)
  create(@Body() createViajeDto: CreateViajeDto, @GetUser() user: any):Promise<any> {
            return this.viajeService.createViaje(createViajeDto,user);
  }

  //consulta
  @Post('viajesRango')
  findDisponibles(
    @Query('fechaInicio') fechaInicio?: string, 
    @Query('fechaFin') fechaFin?: string,
    @Body() camiones?: ConsultarUnidadesDto){
      const inicio = fechaInicio ? new Date(fechaInicio) : undefined;
      const fin = fechaFin ? new Date(fechaFin) : undefined;
      console.log('Fechas recibidas:', inicio, fin);
      return this.viajeService.buscarUnidadesDisponibles(inicio, fin, camiones);
  }


  //consulta de los viajes del cliente
  @Get('misViajes')
  @UseGuards(AuthGuard)
  findAll(@GetUser() user: any) {
    return this.viajeService.buscarTodos(user);
  }
  
  @Get('viajesCliente')
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

  @Patch('rechazarViaje/:id')
  async rechazarViaje(@Param('id') id: number) {
    return this.viajeService.rechazarViaje(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.viajeService.findOne(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viajeService.remove(+id);
  }

  @Patch('finalizar/:id')
  finalizar(@Param('id') id: number) {
    return this.viajeService.finalizarViaje(id);
  }

  @Patch('iniciar/:id')
  iniciar(@Param('id') id: number) {
    return this.viajeService.enViaje(id);
  }

  @Patch('cancelar/:id')
  cancelar(@Param('id') id: number) {
  return this.viajeService.cancelarViaje(id);
  }

@Patch(':id/confirmar-pago')
async confirmarPago(@Param('id') id: string) {
  return this.viajeService.confirmarPagoViaje(+id);
}
}
