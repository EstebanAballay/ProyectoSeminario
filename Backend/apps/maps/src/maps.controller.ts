import { Controller, Get } from '@nestjs/common';
import { MapsService } from './maps.service';

@Controller()
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get()
  getHello(): string {
    return this.mapsService.getHello();
  }
}
