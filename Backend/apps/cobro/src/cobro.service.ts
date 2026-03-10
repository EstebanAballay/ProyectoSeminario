import { Injectable, Logger, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Cobro, tipoCobro } from './entities/cobro.entity';
import { EstadoCobro } from './entities/estadoCobro.entity';
import { CreateCobroDto } from './entities/create-cobro-dto';
import { Abonante } from './entities/abonante.entity';
import { BillingService } from './billing.service';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';

@Injectable()
export class CobroService {
    private readonly logger = new Logger(CobroService.name);

    constructor(
        @InjectRepository(Cobro) private readonly cobroRepo: Repository<Cobro>,
        @InjectRepository(EstadoCobro) private estadoRepo: Repository<EstadoCobro>,
        @InjectRepository(Abonante) private abonanteRepo: Repository<Abonante>,
        private readonly httpService: HttpService,
        private readonly billingService: BillingService
    ) { }

    /**
     * Crea el registro inicial en Supabase.
     */
    async crearCobro(dto: CreateCobroDto) {
        console.log(dto);
        //para asegurar que el cliente no modifico el monto de la senia, pido al service de viaje que me envie el viaje seguro
        const viajeSeguro = await firstValueFrom(this.httpService.get(`${process.env.VIAJE_SERVICE_URL}/viaje/${Number(dto.viajeId)}`));
        //verifico si el cobro es una senia o un resto segun lo que me venga del dto y genero el cobro con el monto correspondiente
        let montoACobrar = 0;
        switch (dto.tipo) {
            case tipoCobro.SENIA:
                montoACobrar = viajeSeguro.data.sena
                break
            case tipoCobro.RESTO:
                montoACobrar = viajeSeguro.data.resto
                break
        }

        //busco el estado pendiente
        const estadoEntity = await this.estadoRepo.findOne({ where: { nombre: 'pendiente' } });

        //armo data, que contiene los datos necesarios para crear el cobro
        const data = { viajeId: Number(dto.viajeId), monto: montoACobrar, estado: estadoEntity, tipo: dto.tipo };
        const nuevoCobro = this.cobroRepo.create(data);
        const guardado = await this.cobroRepo.save(nuevoCobro);
        this.logger.log(`✅ Cobro creado: ID ${guardado.id} por $${guardado.monto}`);
        return guardado;
    }

    /**
     * Busca un cobro por ID. Fundamental para evitar el error 404 en Postman.
     */
    async obtenerPorId(id: number) {
        const cobro = await this.cobroRepo.findOne({ where: { id } });
        if (!cobro) {
            throw new NotFoundException(`El cobro con ID ${id} no existe.`);
        }
        return cobro;
    }

    /**
     * Genera el link de pago real usando el microservicio de MP y Ngrok.
     */
    async generarPagoMP(cobroId: number) {
        const cobro = await this.obtenerPorId(cobroId);
        console.log("estoy intentando generar el link de pago,afuera del try");
        try {
            console.log("estoy intentando generar el link de pago");
            const response = await firstValueFrom(
                this.httpService.post(`${process.env.MP_SERVICE_URL}/mercadopago/create`, {
                    cobroId: cobro.id,
                    monto: cobro.monto,
                    // Usamos la URL completa definida en el .env para el túnel de Ngrok
                    notificationUrl: process.env.MP_GCLOUD_URL
                })
            );

            this.logger.log(`⏳ Link generado para cobro ${cobroId}. Notificaciones en: ${process.env.MP_GCLOUD_URL}`);
            return response.data; // Retorna el init_point para el navegador
        } catch (error) {
            this.logger.error(`❌ Error al conectar con MP-Service: ${error.message}`);
            throw error;
        }
    }

    /**
     * Consulta al microservicio de MP los detalles para obtener el cobroId real
     * y confirmar la transacción en Supabase tras el aviso de Ngrok.
     */
    async verificarYConfirmarPago(paymentId: string) {
        try {
            //le pregutnamos a mp si el pago fue hecho
            const response = await firstValueFrom(
                this.httpService.get(`${process.env.MP_SERVICE_URL}/mercadopago/verificar/${paymentId}`)
            );

            console.log('la devolucion del payer de mp es:', response.data.payer);
            const payer = response.data.payer
            //creamos el abonante cuando recibimos sus datos
            const nuevoAbonante = this.abonanteRepo.create({
                nombre: payer.nombre,
                apellido: payer.apellido,
                numeroDocumento: payer.numeroDocumento,
                tipoDocumento: payer.tipoDocumento,
                email: payer.email,
                telefono: payer.telefono
            })

            const guardado = await this.abonanteRepo.save(nuevoAbonante);
            console.log('el abonante guardado es este:', nuevoAbonante);
            const { cobroId, status } = response.data;

            //asignamos al abonante al cobro creado anteriormente. Hay que pasarlo un objeto,sino usar .save pero es mas lento
            const cobroEncontrado = await this.cobroRepo.findOne({ where: { id: cobroId } })
            console.log(cobroEncontrado)
            //si el pago es aprobado, ordenamos actualizar el estado del cobro y del viaje
            if (status === 'approved') {
                console.log('el payment id de mp es:', paymentId)
                await this.cobroRepo.update({ id: cobroId }, { abonante: { id: guardado.id } as any })
                await this.confirmarPagoMP(cobroId, status, paymentId);
            }
        } catch (error) {
            this.logger.error(`Error verificando pago ${paymentId}: ${error.message}`);
        }
    }

    /** 
     * Impacta el cambio de estado en la base de datos de Supabase.
     */
    async confirmarPagoMP(cobroId: string, status: string, paymentId: string) {
        //nombre de los estados 
        const estadoFinal = status === 'approved' ? 'pagado' : 'rechazado';
        //busco el estado final por su nombre
        const estadoEntity = await this.estadoRepo.findOne({ where: { nombre: estadoFinal } });
        //actualizamos el estado del cobro
        await this.cobroRepo.update(
            { id: Number(cobroId) },
            {
                estado: estadoEntity,
                transactionId: paymentId
            }
        );
        console.log(`💰 Cobro ${cobroId} actualizado a ${estadoFinal} en base de datos.`);

        // Si el pago fue aprobado, notificamos al microservicio de Viaje
        if (status === 'approved') {
            // Necesitamos el cobro para obtener el viajeId asociado
            const cobro = await this.obtenerPorId(Number(cobroId));

            try {
                // Llamada interna al puerto 3004 del microservicio de Viaje para actualizar su estado
                if (cobro.tipo == 'senia') {
                    await firstValueFrom(
                        this.httpService.patch(`${process.env.VIAJE_SERVICE_URL}/viaje/${cobro.viajeId}/pago-senia`, {})
                    );
                    try {
                        await this.generarPdf(Number(cobroId), cobro.viajeId);
                    } catch (error) {
                        console.log('error al generar el pdf', error);
                    }

                    console.log(`🚀 Sincronización exitosa: Viaje ${cobro.viajeId} actualizado a PAGADO.`);
                }
                else if (cobro.tipo == 'resto') {
                    await firstValueFrom(
                        this.httpService.patch(`${process.env.VIAJE_SERVICE_URL}/viaje/${cobro.viajeId}/pago-resto`, {})
                    );
                    try {
                        await this.generarPdf(Number(cobroId), cobro.viajeId);
                    } catch (error) {
                        console.log('error al generar el pdf', error);
                    }
                    console.log(`🚀 Sincronización exitosa: Viaje ${cobro.viajeId} actualizado a PAGADO.`);
                }

            } catch (error) {
                console.error(`❌ Error de sincronización: No se pudo avisar al microservicio de Viaje. ${error.message}`);
            }
        }

        this.logger.log(`🔔 WEBHOOK PROCESADO: Cobro ${cobroId} actualizado a [${estadoFinal}]`);
        return { success: true };
    }


    async generarPdf(cobroId: number, viajeId: number) {
        const pdfBuffer = await this.billingService.generarFactura(Number(cobroId), viajeId)
        return pdfBuffer;
    }

    async consultarCobrosUsuario(user: any) {
        const estadoPagado = await this.estadoRepo.findOne({ where: { id: 2 } });
        const cobros = await this.cobroRepo.find({ where: { abonante: user.id, estado: estadoPagado } });
        if (cobros.length === 0) {
            return [];
        }
        const idViajes = cobros.map((cobro: any) => cobro.viajeId);

        // 1. Convertimos el array de IDs en un string separado por comas (Ej: "14,25,8")
        const idsQuery = idViajes.join(',');

        // 2. Hacemos la petición GET al microservicio de Viajes. 
        // (Ajustá el puerto y la ruta según cómo lo tengan configurado)
        const urlViajes = `${process.env.VIAJE_SERVICE_URL}/viaje/por-ids?ids=${idsQuery}`;

        // Usamos firstValueFrom para esperar la respuesta HTTP
        const respuestaHttp = await firstValueFrom(this.httpService.get(urlViajes));
        const viajes = respuestaHttp.data;

        // 3. Combinamos los datos: a cada cobro le adjuntamos la información de su viaje
        const cobrosCompletos = cobros.map(cobro => {
            const viajeAsociado = viajes.find((v: any) => v.ViajeId === cobro.viajeId);
            return {
                ...cobro,
                viaje: viajeAsociado // Adjuntamos el objeto viaje completo
            };
        });
        return cobrosCompletos;
    }

    async descargarFacturaCobro(id: number, res: Response) {
        console.log('intentando descargar factura desde GCS')
        // 1. Buscamos el cobro para saber el viajeId (necesario para el nombre del archivo)
        const cobro = await this.cobroRepo.findOne({ where: { id: id } });

        // 2. Reconstruimos el nombre exacto con el que lo guardó el billing.service
        const nombreArchivo = `Factura_Viaje${cobro.viajeId}_Cobro${cobro.id}.pdf`;

        // 3. Descargamos desde Google Cloud Storage
        const { Storage } = require('@google-cloud/storage');
        const storage = new Storage();
        const bucketName = process.env.GCS_BUCKET || 'grafo-logistica-facturas';
        const file = storage.bucket(bucketName).file(nombreArchivo);

        // 4. Verificamos si el archivo existe en GCS
        const [exists] = await file.exists();
        if (!exists) {
            throw new NotFoundException('La factura aún se está generando. Por favor, aguarde unos segundos y vuelva a intentar.');
        }

        // 5. Configuramos las cabeceras para forzar la descarga en el navegador
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="Factura_Transporte_Grafo_N${cobro.id}.pdf"`,
        });

        // 6. Creamos un stream de lectura desde GCS y lo enviamos al navegador
        const readStream = file.createReadStream();
        readStream.pipe(res);
    }
}