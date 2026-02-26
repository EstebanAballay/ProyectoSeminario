import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UnidadService } from './unidad.service';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
import { promises } from 'dns';
import { ConsultarUnidadesDto } from './dto/datosUnidadesFront.dto';
import { CreateVehicleDto } from './dto/create-Vehicle.dto';
import { CreateTransportistaFromUserDto } from './dto/create-transportista-from-user.dto';

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
    return await this.unidadService.asignarChoferes(dto.asignaciones);
  }

  @Get('admin/vehiculos')
  async listarVehiculosAdmin() {
    return this.unidadService.listarVehiculosAdmin();
  }
  
  @Get('por-chofer')
  async getViajesPorChoferQuery(@Query('choferId') choferId: number) {
    console.log('Recibida petición interna de unidades para chofer:', choferId);
    return this.unidadService.findViajesPorChofer(+choferId);
  }
  
  @Post('nuevaUnidad')
  async crearUnidad(@Body() createUnidadDto: CreateVehicleDto) {
    return await this.unidadService.createVehicle(createUnidadDto);
  } 

  @Post('transportistas')
  async crearTransportistaDesdeUsuario(@Body() dto: CreateTransportistaFromUserDto) {
    return await this.unidadService.createTransportistaDesdeUsuario(dto);
  }

  @Get()  
  async buscarUnidades(@Query('idViaje') idViaje?: number) {
    if (idViaje) {
      // Si llega el parámetro, buscamos por viaje
      return this.unidadService.find(idViaje);
    }
  }

  @Patch('iniciarEstadoViaje/:id')
  async iniciarEstadoViaje(@Param('id') id: number) {
    return this.unidadService.iniciarEstadoViaje(id);
  }
  
  @Patch('finalizarEstadoViaje/:id')
  async finalizarEstadoViaje(@Param('id') id: number) {
    return this.unidadService.finalizarEstadoViaje(id);
  }

  //se usa en 2 casos de uso- CUIDADO!!
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('entre al controller')
    const found = this.unidadService.findOne(+id);
    //console.log(found);
    return found;
  }

  @Get('unidades-de-viaje/:id')
  async findAll(@Param('id') id: string): Promise<any> {
    return this.unidadService.findUnityByDriver(+id);
  }

  @Get('viajesPorChofer/:choferId')
  async findViajesPorChofer(@Param('choferId') choferId: number) {
    return this.unidadService.findViajesPorChofer(choferId);
  }

  @Patch('admin/vehiculos/:tipo/:id/estado')
  async cambiarEstadoVehiculo(
    @Param('tipo') tipo: string,
    @Param('id') id: string,
    @Body() body: { estado: string },
  ) {
    return this.unidadService.cambiarEstadoVehiculo(tipo, Number(id), body?.estado);
  }

  @Patch('admin/vehiculos/:tipo/:id')
  async modificarVehiculo(
    @Param('tipo') tipo: string,
    @Param('id') id: string,
    @Body() dto: Partial<CreateVehicleDto>,
  ) {
    return this.unidadService.modificarVehiculo(tipo, Number(id), dto);
  }

}
