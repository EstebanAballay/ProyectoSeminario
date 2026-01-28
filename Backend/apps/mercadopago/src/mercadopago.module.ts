import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MercadopagoController } from './mercadopago.controller';
import { MercadoPagoService } from './mercadopago.service';

@Module({
  imports: [HttpModule],
  controllers: [MercadopagoController],
  providers: [MercadoPagoService],
  exports: [MercadoPagoService],
})
export class MercadoPagoModule {}
