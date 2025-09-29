import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ViajeService } from './viaje.service';
import { CreateViajeDto } from './dto/create-viaje.dto';

@Controller('viaje')
export class ViajeController {
  constructor(private readonly viajeService: ViajeService) {}

  //crear
  @Post('nuevoViaje')
  create(@Body() createViajeDto: CreateViajeDto):Promise<any> {
    return this.viajeService.createViaje(createViajeDto);
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
}
