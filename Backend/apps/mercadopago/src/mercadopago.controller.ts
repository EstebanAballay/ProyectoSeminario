import { Controller, Post, Body } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';

@Controller('mercadopago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  @Post('create')
  async createPreference(@Body() data: { cobroId: number; monto: number }) {
    return await this.mercadoPagoService.createPreference(data);
  }
  
}
