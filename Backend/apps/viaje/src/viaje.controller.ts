import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ViajeService } from './viaje.service';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { ConsultarUnidadesDto } from './dto/camiones.dto';

@Controller('viaje')
export class ViajeController {
  constructor(private readonly viajeService: ViajeService) {}
  //  viaje/nuevoViaje
  //crear
  @Post('nuevoViaje')
  create(@Body() createViajeDto: CreateViajeDto):Promise<any> {
    return this.viajeService.createViaje(createViajeDto);
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


  //consulta
  @Get()
  findAll() {
    return this.viajeService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.viajeService.findOne(+id);
  }

  //actualiza
  /*
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateViajeDto: UpdateViajeDto) {
    return this.viajeService.update(+id, updateViajeDto);
  }
*/
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viajeService.remove(+id);
  }

  @Patch('finalizar/:id')
  finalizar(@Param('id') id: number) {
    return this.viajeService.enViaje(id);
  }
}
