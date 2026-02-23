import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Viaje } from './entities/viaje.entity';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async enviarMailReserva(email: string, viaje: Viaje) {
        await this.mailerService.sendMail({
        to: email,
        subject: `🚛 Reserva confirmada - Viaje #${viaje.ViajeId}`,
        html: `
            <h2>Reserva confirmada</h2>
            <p>Origen: ${viaje.destinoInicio}</p>
            <p>Destino: ${viaje.destinoFin}</p>
            <p>Fecha: ${viaje.fechaInicio}</p>
        `,
        });

        console.log('📧 Mail de reserva enviado');
    }

    async enviarMailCancelacion(email: string, viaje: Viaje) {
        await this.mailerService.sendMail({
        to: email,
        subject: '🚫 Viaje cancelado - Grafo Logística',
        html: `
            <h2>Tu viaje fue cancelado</h2>
            <p>ID: ${viaje.ViajeId}</p>
            <p>Fecha inicio: ${viaje.fechaInicio}</p>
        `,
        });

        console.log('📧 Mail de cancelación enviado');
    }
}