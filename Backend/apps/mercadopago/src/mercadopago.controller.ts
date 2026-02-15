import { Body, Controller, Post, Get, Param, BadRequestException } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';

@Controller('mercadopago')
export class MercadopagoController {
  constructor(private readonly service: MercadoPagoService) {}

  @Post('create')
  async create(@Body() body: { cobroId: number; monto: number; notificationUrl: string }) {
    if (!body || !body.cobroId || !body.monto || !body.notificationUrl) {
      throw new BadRequestException(
        'El cuerpo de la petición debe incluir cobroId, monto y notificationUrl',
      );
    }

    return this.service.createPreference(
      body.cobroId, 
      body.monto, 
      body.notificationUrl
    );
  }

  @Get('verificar/:paymentId')
  async verificar(@Param('paymentId') paymentId: string) {
    return this.service.getPaymentDetails(paymentId);
  }
}