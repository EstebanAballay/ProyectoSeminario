<<<<<<< HEAD
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
=======
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
import { UnidadService } from './unidad.service';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
import { promises } from 'dns';
import { ConsultarUnidadesDto } from './dto/datosUnidadesFront.dto';
<<<<<<< HEAD
import { CreateVehicleDto } from './dto/create-Vehicle.dto';
=======
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d

@Controller('unidad')
export class UnidadController {
  constructor(private readonly unidadService: UnidadService) {}

  @Post()
  create(@Body() createUnidadDto: CreateUnidadDto): Promise<any> {
    return this.unidadService.createUnidad(createUnidadDto);
  }

<<<<<<< HEAD
=======
  @Get()
  finndAll(): any {
    return this.unidadService.findAll();}


  @Get(':id/')
  async findAll(@Param('id') id: String): Promise<any> {
    return this.unidadService.findUnityByDriver(Number(id));}
    
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
  @Get('tiposAcoplados')
  consultarTiposAcoplados() {
    return this.unidadService.consultarTiposAcoplados();
  }

  @Get('tiposCamiones')
  consultarTiposCamiones() {
<<<<<<< HEAD
    console.log("el erro salta despues")
    return this.unidadService.consultarTiposCamiones();
  }

  @Get('por-chofer')
  async getViajesPorChoferQuery(@Query('choferId') choferId: number) {
    console.log('Recibida petición interna de unidades para chofer:', choferId);
    return this.unidadService.findViajesPorChofer(+choferId);
  }

   @Get('viajesPorChofer/:choferId')
  async findViajesPorChofer(@Param('choferId') choferId: number) {
    return this.unidadService.findViajesPorChofer(choferId);

  }

=======
    return this.unidadService.consultarTiposCamiones();
  }

>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
  @Post('unidadesDisponibles')
  async consultarUnidadesDisponibles(@Body() dto?: ConsultarUnidadesDto) {
    const disponiblesPorFecha = await this.unidadService.findDisponibles(dto.unidadesOcupadas);
    console.log('Unidades disponibles por fecha:', disponiblesPorFecha);
<<<<<<< HEAD
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
    iniciarEstadoViaje(@Param('id') id: string) {
    return this.unidadService.iniciarEstadoViaje(+id);
=======
    return this.unidadService.findUnidadesDisponiblesByTipoRandom(dto.camiones, disponiblesPorFecha);
  } 

@Patch('iniciarEstadoViaje/:id')
  async iniciarEstadoViaje(@Param('id') id: number) {
    return this.unidadService.iniciarEstadoViaje(id);
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
  }
  
  @Patch('finalizarEstadoViaje/:id')
  async finalizarEstadoViaje(@Param('id') id: number) {
    return this.unidadService.finalizarEstadoViaje(id);
  }

<<<<<<< HEAD
  @Post('nuevaUnidad')
  async crearUnidad(@Body() createUnidadDto: CreateVehicleDto) {
    return await this.unidadService.createVehicle(createUnidadDto);
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

    @Get(':id/')
  async findAll(@Param('id') id: String): Promise<any> {
    return this.unidadService.findUnityByDriver(Number(id));}
    
=======
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unidadService.findOne(+id);
  }
<<<<<<< HEAD
}
=======

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnidadDto: UpdateUnidadDto) {
    return this.unidadService.update(+id, updateUnidadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unidadService.remove(+id);
  }



}
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
