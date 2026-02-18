import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Cobro } from './entities/cobro.entity';
import { EstadoCobro } from './entities/estadoCobro.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class CobroService {
    private readonly logger = new Logger(CobroService.name);

    private transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    constructor(
        @InjectRepository(Cobro) private readonly cobroRepo: Repository<Cobro>,
        @InjectRepository(EstadoCobro) private estadoRepo: Repository<EstadoCobro>, 
        private readonly httpService: HttpService,
    ) {}

    async crearCobro(viajeId: number) {
        const viajeSeguro = await firstValueFrom(
            this.httpService.get(`http://viaje-service:3004/viaje/${viajeId}`)
        );
        const monto = viajeSeguro.data.sena;

        const estadoEntity = await this.estadoRepo.findOne({ where: { nombre: 'pendiente' } });

        const data = { viajeId, monto, estado: estadoEntity };
        console.log(data);
        const nuevoCobro = this.cobroRepo.create(data);
        const guardado = await this.cobroRepo.save(nuevoCobro);
        this.logger.log(`✅ Cobro creado: ID ${guardado.id} por $${guardado.monto}`);
        return guardado;
    } 

    async obtenerPorId(id: number) {
        const cobro = await this.cobroRepo.findOne({ where: { id } });
        if (!cobro) {
            throw new NotFoundException(`El cobro con ID ${id} no existe.`);
        }
        return cobro;
    }

    async generarPagoMP(cobroId: number) {
        const cobro = await this.obtenerPorId(cobroId);
        console.log("estoy intentando generar el link de pago,afuera del try");
        try {
            console.log("estoy intentando generar el link de pago");
            const response = await firstValueFrom(
                this.httpService.post(`${process.env.MP_SERVICE_URL}/mercadopago/create`, {
                    cobroId: cobro.id,
                    monto: cobro.monto,
                    notificationUrl: process.env.NGROK_WEBHOOK_URL 
                })
            );

            this.logger.log(`⏳ Link generado para cobro ${cobroId}. Notificaciones en: ${process.env.NGROK_WEBHOOK_URL}`);
            return response.data;
        } catch (error) {
            this.logger.error(`❌ Error al conectar con MP-Service: ${error.message}`);
            throw error;
        }
    }

    async verificarYConfirmarPago(paymentId: string) {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${process.env.MP_SERVICE_URL}/mercadopago/verificar/${paymentId}`)
            );

            const { cobroId, status } = response.data;

            if (status === 'approved') {
                await this.confirmarPagoMP(cobroId, status, paymentId);
            }
        } catch (error) {
            this.logger.error(`Error verificando pago ${paymentId}: ${error.message}`);
        }
    }

    async confirmarPagoMP(cobroId: string, status: string, paymentId: string) {
        const estadoFinal = status === 'approved' ? 'pagado' : 'rechazado';

        const estadoEntity = await this.estadoRepo.findOne({ where: { nombre: estadoFinal } });

        await this.cobroRepo.update(
            { id: Number(cobroId) },
            { 
                estado: estadoEntity, 
                transactionId: paymentId 
            }
        );

        console.log(`💰 Cobro ${cobroId} actualizado a ${estadoFinal} en base de datos.`);

        if (status === 'approved') {

            const cobro = await this.obtenerPorId(Number(cobroId));

            try {
                await firstValueFrom(
                    this.httpService.patch(`http://viaje-service:3004/viaje/${cobro.viajeId}/confirmar-pago`, {})
                );

                console.log(`🚀 Sincronización exitosa: Viaje ${cobro.viajeId} actualizado a PAGADO.`);


                const viajeResponse = await firstValueFrom(
                    this.httpService.get(`http://viaje-service:3004/viaje/${cobro.viajeId}`)
                );

                const viaje = viajeResponse.data;

                const userResponse = await firstValueFrom(
                    this.httpService.get(`http://users-service:3003/users/${viaje.usuarioId}`)
                );

                const usuario = userResponse.data;

                try {
                    await this.transporter.sendMail({
                        from: `"Sistema Logística" <${process.env.SMTP_USER}>`,
                        to: usuario.email,
                        subject: 'Pago acreditado ✅',
                        html: `
                            <h2>¡Pago confirmado!</h2>
                            <p>Tu pago para el viaje #${viaje.ViajeId} fue acreditado correctamente.</p>
                            <p><strong>Monto:</strong> $${cobro.monto}</p>
                            <p>Gracias por confiar en nosotros.</p>
                        `,
                    });

                    console.log('📧 Email enviado correctamente');
                } catch (mailError) {
                    console.error('❌ Error enviando email:', mailError.message);
                }

            } catch (error) {
                console.error(`❌ Error de sincronización: No se pudo avisar al microservicio de Viaje. ${error.message}`);
            }
        }

        this.logger.log(`🔔 WEBHOOK PROCESADO: Cobro ${cobroId} actualizado a [${estadoFinal}]`);
        return { success: true };
    }
}
