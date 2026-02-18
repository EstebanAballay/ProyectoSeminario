import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Cobro, tipoCobro } from './entities/cobro.entity';
import { EstadoCobro } from './entities/estadoCobro.entity';
import * as nodemailer from 'nodemailer';
import { CreateCobroDto } from './entities/create-cobro-dto';
import { Abonante } from './entities/abonante.entity';

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
        @InjectRepository(Cobro)
        private readonly cobroRepo: Repository<Cobro>,

        @InjectRepository(EstadoCobro)
        private readonly estadoRepo: Repository<EstadoCobro>,

        @InjectRepository(Abonante)
        private readonly abonanteRepo: Repository<Abonante>,

        private readonly httpService: HttpService,
    ) {}

    // ================================
    // CREAR COBRO
    // ================================
    async crearCobro(dto: CreateCobroDto) {
        const viajeSeguro = await firstValueFrom(
        this.httpService.get(
            `http://viaje-service:3004/viaje/${Number(dto.viajeId)}`,
        ),
        );

        let montoACobrar = 0;

        switch (dto.tipo) {
        case tipoCobro.SENIA:
            montoACobrar = viajeSeguro.data.sena;
            break;
        case tipoCobro.RESTO:
            montoACobrar = viajeSeguro.data.resto;
            break;
        }

        const estadoEntity = await this.estadoRepo.findOne({
        where: { nombre: 'pendiente' },
        });

        const nuevoCobro = this.cobroRepo.create({
        viajeId: Number(dto.viajeId),
        monto: montoACobrar,
        estado: estadoEntity,
        tipo: dto.tipo,
        });

        const guardado = await this.cobroRepo.save(nuevoCobro);

        this.logger.log(
        `✅ Cobro creado: ID ${guardado.id} por $${guardado.monto}`,
        );

        return guardado;
    }

    // ================================
    // OBTENER POR ID
    // ================================
    async obtenerPorId(id: number) {
        const cobro = await this.cobroRepo.findOne({ where: { id } });

        if (!cobro) {
        throw new NotFoundException(
            `El cobro con ID ${id} no existe.`,
        );
        }

        return cobro;
    }

    // ================================
    // GENERAR LINK MP
    // ================================
    async generarPagoMP(cobroId: number) {
        const cobro = await this.obtenerPorId(cobroId);

        try {
        const response = await firstValueFrom(
            this.httpService.post(
            `${process.env.MP_SERVICE_URL}/mercadopago/create`,
            {
                cobroId: cobro.id,
                monto: cobro.monto,
                notificationUrl: process.env.NGROK_WEBHOOK_URL,
            },
            ),
        );

        this.logger.log(`⏳ Link generado para cobro ${cobroId}`);

        return response.data;
        } catch (error) {
        this.logger.error(
            `❌ Error al conectar con MP-Service: ${error.message}`,
        );
        throw error;
        }
    }

    // ================================
    // VERIFICAR PAGO (WEBHOOK)
    // ================================
    async verificarYConfirmarPago(paymentId: string) {
        try {
        const response = await firstValueFrom(
            this.httpService.get(
            `${process.env.MP_SERVICE_URL}/mercadopago/verificar/${paymentId}`,
            ),
        );

        const { cobroId, status, payer } = response.data;

        // Crear abonante
        const nuevoAbonante = this.abonanteRepo.create({
            nombre: payer.nombre,
            apellido: payer.apellido,
            numeroDocumento: payer.numeroDocumento,
            tipoDocumento: payer.tipoDocumento,
            email: payer.email,
            telefono: payer.telefono,
        });

        const abonanteGuardado =
            await this.abonanteRepo.save(nuevoAbonante);

        // Confirmar pago
        if (status === 'approved') {
            await this.confirmarPagoMP(
            cobroId,
            status,
            paymentId,
            abonanteGuardado.id,
            );
        }
        } catch (error) {
        this.logger.error(
            `Error verificando pago ${paymentId}: ${error.message}`,
        );
        }
    }

    // ================================
    // CONFIRMAR PAGO
    // ================================
    async confirmarPagoMP(
        cobroId: string,
        status: string,
        paymentId: string,
        abonanteId: number,
    ) {
        const estadoFinal =
        status === 'approved' ? 'pagado' : 'rechazado';

        const estadoEntity = await this.estadoRepo.findOne({
        where: { nombre: estadoFinal },
        });

        await this.cobroRepo.update(
        { id: Number(cobroId) },
        {
            estado: estadoEntity,
            transactionId: paymentId,
            abonante: { id: abonanteId } as any,
        },
        );

        const cobro = await this.obtenerPorId(Number(cobroId));

        // Si fue aprobado → actualizar viaje
        if (status === 'approved') {
        if (cobro.tipo === tipoCobro.SENIA) {
            await firstValueFrom(
            this.httpService.patch(
                `http://viaje-service:3004/viaje/${cobro.viajeId}/pago-senia`,
                {},
            ),
            );
        } else if (cobro.tipo === tipoCobro.RESTO) {
            await firstValueFrom(
            this.httpService.patch(
                `http://viaje-service:3004/viaje/${cobro.viajeId}/pago-resto`,
                {},
            ),
            );
        }

        // Obtener datos para email
        const viajeResponse = await firstValueFrom(
            this.httpService.get(
            `http://viaje-service:3004/viaje/${cobro.viajeId}`,
            ),
        );

        const viaje = viajeResponse.data;

        const userResponse = await firstValueFrom(
            this.httpService.get(
            `http://users-service:3003/users/${viaje.usuarioId}`,
            ),
        );

        const usuario = userResponse.data;

        // Enviar email
        try {
            await this.transporter.sendMail({
            from: `"Sistema Logística" <${process.env.SMTP_USER}>`,
            to: usuario.email,
            subject: 'Pago acreditado ✅',
            html: `
                <h2>¡Pago confirmado!</h2>
                <p>Tu pago para el viaje #${viaje.id} fue acreditado correctamente.</p>
                <p><strong>Monto:</strong> $${cobro.monto}</p>
                <p>Gracias por confiar en nosotros.</p>
            `,
            });

            this.logger.log('📧 Email enviado correctamente');
        } catch (mailError) {
            this.logger.error(
            `❌ Error enviando email: ${mailError.message}`,
            );
        }
        }

        this.logger.log(
        `🔔 WEBHOOK PROCESADO: Cobro ${cobroId} actualizado a [${estadoFinal}]`,
        );

        return { success: true };
    }
}
