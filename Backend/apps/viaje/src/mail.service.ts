import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {

        console.log("MAIL_HOST:", process.env.MAIL_HOST);
        console.log("MAIL_PORT:", process.env.MAIL_PORT);
        console.log("MAIL_USER:", process.env.MAIL_USER);
        console.log("MAIL_PASS:", process.env.MAIL_PASS);

        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    async enviarMailReserva(emailDestino: string, viajeId: number, destino: string) {
        const mailOptions = {
            from: `"Sistema Logística" <${process.env.MAIL_USER}>`,
            to: emailDestino,
            subject: `✅ Reserva Confirmada - Viaje #${viajeId}`,
            html: `<h2>¡Reserva Exitosa!</h2><p>Tu viaje a <b>${destino}</b> ha sido registrado.</p>`,
        };
        return this.transporter.sendMail(mailOptions);
    }

    async enviarMailCancelacion(emailDestino: string, viajeId: number, destino: string) {
        const mailOptions = {
            from: `"Sistema Logística" <${process.env.MAIL_USER}>`,
            to: emailDestino,
            subject: `⚠️ Cancelación de Viaje #${viajeId}`,
            html: `<h2>Viaje Cancelado</h2><p>El viaje a <b>${destino}</b> ha sido cancelado.</p>`,
        };
        return this.transporter.sendMail(mailOptions);
    }
}
