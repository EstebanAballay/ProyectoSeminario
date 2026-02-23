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
    @Body() dtoViaje?: ConsultarUnidadesDto){
      const inicio = fechaInicio ? new Date(fechaInicio) : undefined;
      console.log('Fechas recibidas:', inicio);
      return this.viajeService.buscarUnidadesDisponibles(inicio, dtoViaje);
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
  findOne(@Param('id') id: number) {
    return this.viajeService.findOne(id);
  }

  @Get('/viaje-con-unidades/:id')
  findViajeXUnidad(@Param('id') id: number) {
    return this.viajeService.findViajeXUnidad(id);
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

  @Patch(':id/pago-senia')
  async confirmarPagoSenia(@Param('id') id: string) {
    return this.viajeService.confirmarPagoViajeSenia(+id);
  }

  @Patch(':id/pago-resto')
  async confirmarPagResto(@Param('id') id: string) {
    return this.viajeService.confirmarPagoViajeResto(+id);
  }
}
