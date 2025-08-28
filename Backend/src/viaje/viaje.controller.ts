import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ViajeService } from './viaje.service';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';

@Controller('viaje')
export class ViajeController {
  constructor(private readonly viajeService: ViajeService) {}

  @Post()
  create(@Body() createViajeDto: CreateViajeDto) {
    return this.viajeService.create(createViajeDto);
  }

  @Get()
  findAll() {
    return this.viajeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.viajeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateViajeDto: UpdateViajeDto) {
    return this.viajeService.update(+id, updateViajeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viajeService.remove(+id);
  }
}
