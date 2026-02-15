import { Controller, Post, Body, Query, Logger } from '@nestjs/common';
import { CobroService } from '../cobro.service';

@Controller('webhooks')
export class WebhookController {
    private readonly logger = new Logger(WebhookController.name);

    constructor(private readonly cobroService: CobroService) {}

    @Post('mercadopago')
    async handleMercadoPagoWebhook(
        @Query('data.id') paymentId: string, // ID de la transacción que viene en la URL
        @Query('type') type: string,
        @Body() body: any
    ) {
        // Mercado Pago envía notificaciones de varios tipos. Solo nos importa 'payment'.
        if (type === 'payment' && paymentId) {
            this.logger.log(`🔔 Notificación de pago recibida: ID ${paymentId}`);

            // 1. IMPORTANTE: Aquí llamamos a una función de verificación.
            // MP no nos envía el cobroId en el webhook por seguridad, 
            // así que le pedimos a nuestro servicio que lo verifique con la API de MP.
            await this.cobroService.verificarYConfirmarPago(paymentId);
        }

        // Siempre responder 200 o 201 a Mercado Pago para que no reintente el envío
        return { received: true };
    }
}