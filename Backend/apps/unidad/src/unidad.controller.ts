import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UnidadService } from './unidad.service';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
import { ConsultarUnidadesDto } from './dto/datosUnidadesFront.dto';

@Controller('unidad')
export class UnidadController {
  constructor(private readonly unidadService: UnidadService) {}

  @Post()
  create(@Body() createUnidadDto: CreateUnidadDto): Promise<any> {
    return this.unidadService.createUnidad(createUnidadDto);
  }

  @Get('tiposAcoplados')
  consultarTiposAcoplados() {
    return this.unidadService.consultarTiposAcoplados();
  }

  @Get('tiposCamiones')
  consultarTiposCamiones() {
    return this.unidadService.consultarTiposCamiones();
  }

  @Post('unidadesDisponibles')
  async consultarUnidadesDisponibles(@Body() dto?: ConsultarUnidadesDto) {
    const disponiblesPorFecha = await this.unidadService.findDisponibles(dto.unidadesOcupadas);
    console.log('Unidades disponibles por fecha:', disponiblesPorFecha);
    const disponiblesPorTipo =  this.unidadService.findUnidadesDisponiblesByTipoRandom(dto.camiones, disponiblesPorFecha);
    console.log('Unidades disponibles por tipo:', disponiblesPorTipo);
    return disponiblesPorTipo
  } 

  @Post('choferesDisponibles')
  async getChoferesDisponibles(@Body() dto: {idViajesEnRango:number[]}) {
    const disponibles = await this.unidadService.getChoferesDisponibles(dto.idViajesEnRango);
    console.log('Choferes disponibles:', disponibles);
    return disponibles;
  }

  @Get() 
  async buscarUnidades(@Query('idViaje') idViaje?: number) {
    if (idViaje) {
      // Si llega el parámetro, buscamos por viaje
      return this.unidadService.findOne(idViaje);
    }
    // Si no llega parámetro, devuelve todas (opcional)
    return this.unidadService.findAll();
  }

  @Post('asignarChoferes')
  async asignarChoferes(@Body() dto: {asignaciones: {unidadId: number, choferId: number}[]}) {
    console.log('Asignaciones recibidas:', dto.asignaciones);
    return await this.unidadService.asignarChoferes(dto.asignaciones);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnidadDto: UpdateUnidadDto) {
    return this.unidadService.update(+id, updateUnidadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unidadService.remove(+id);
  }
}
