import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UnidadService } from './unidad.service';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
import { promises } from 'dns';
import { ConsultarUnidadesDto } from './dto/datosUnidadesFront.dto';

@Controller('unidad')
export class UnidadController {
  constructor(private readonly unidadService: UnidadService) {}

  @Post()
  create(@Body() createUnidadDto: CreateUnidadDto): Promise<any> {
    return this.unidadService.createUnidad(createUnidadDto);
  }

  @Get()
  finndAll(): any {
    return this.unidadService.findAll();}


  @Get(':id/')
  async findAll(@Param('id') id: String): Promise<any> {
    return this.unidadService.findUnityByDriver(Number(id));}
    
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
    return this.unidadService.findUnidadesDisponiblesByTipoRandom(dto.camiones, disponiblesPorFecha);
  } 

@Patch('iniciarEstadoViaje/:id')
  async iniciarEstadoViaje(@Param('id') id: number) {
    return this.unidadService.iniciarEstadoViaje(id);
  }
  
  @Patch('finalizarEstadoViaje/:id')
  async finalizarEstadoViaje(@Param('id') id: number) {
    return this.unidadService.finalizarEstadoViaje(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unidadService.findOne(+id);
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
