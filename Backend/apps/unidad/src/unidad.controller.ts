import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UnidadService } from './unidad.service';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
import { promises } from 'dns';
import { ConsultarUnidadesDto } from './dto/datosUnidadesFront.dto';
import { CreateVehicleDto } from './dto/create-Vehicle.dto';

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
    console.log("el erro salta despues")
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

  @Post('asignarChoferes')
  async asignarChoferes(@Body() dto: {asignaciones: {unidadId: number, choferId: number}[]}) {
    console.log('Asignaciones recibidas:', dto.asignaciones);
    return await this.unidadService.asignarChoferes(dto.asignaciones);}

  @Patch('iniciarEstadoViaje/:id')
  async iniciarEstadoViaje(@Param('id') id: number) {
    return this.unidadService.iniciarEstadoViaje(id);
  }
  
  @Patch('finalizarEstadoViaje/:id')
  async finalizarEstadoViaje(@Param('id') id: number) {
    return this.unidadService.finalizarEstadoViaje(id);
  }

  @Post('nuevaUnidad')
  async crearUnidad(@Body() createUnidadDto: CreateVehicleDto) {
    return await this.unidadService.createVehicle(createUnidadDto);
  }

    @Get(':id/')
  async findAll(@Param('id') id: String): Promise<any> {
    return this.unidadService.findUnityByDriver(Number(id));}
    
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unidadService.findOne(+id);
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

  @Get('viajesPorChofer/:choferId')
  async findViajesPorChofer(@Param('choferId') choferId: number) {
    return this.unidadService.findViajesPorChofer(choferId);

  }
}
