import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UnidadService } from './unidad.service';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';

@Controller('unidad')
export class UnidadController {
  constructor(private readonly unidadService: UnidadService) {}

  @Post()
  create(@Body() createUnidadDto: CreateUnidadDto) {
    return this.unidadService.create(createUnidadDto);
  }

  @Get()
  findAll() {
    return this.unidadService.findAll();
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
