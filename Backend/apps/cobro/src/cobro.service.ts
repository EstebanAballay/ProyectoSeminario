import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Cobro,tipoCobro } from './entities/cobro.entity';
import { EstadoCobro } from './entities/estadoCobro.entity';
import { CreateCobroDto } from './entities/create-cobro-dto';

@Injectable()
export class CobroService {
    private readonly logger = new Logger(CobroService.name);

    constructor(
        @InjectRepository(Cobro) private readonly cobroRepo: Repository<Cobro>,
        @InjectRepository(EstadoCobro) private estadoRepo: Repository<EstadoCobro>, 
        private readonly httpService: HttpService,
    ) {}

    /**
     * Crea el registro inicial en Supabase.
     */
    async crearCobro(dto: CreateCobroDto) {
        console.log(dto);
        //para asegurar que el cliente no modifico el monto de la senia, pido al service de viaje que me envie el viaje seguro
        const viajeSeguro = await firstValueFrom( this.httpService.get(`http://viaje-service:3004/viaje/${Number(dto.viajeId)}`));
        //verifico si el cobro es una senia o un resto segun lo que me venga del dto y genero el cobro con el monto correspondiente
        let montoACobrar = 0;
        switch(dto.tipo){
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
        const data = { viajeId: Number(dto.viajeId), monto:montoACobrar, estado: estadoEntity, tipo: dto.tipo };
        console.log(data);
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
                    notificationUrl: process.env.NGROK_WEBHOOK_URL 
                })
            );

            this.logger.log(`⏳ Link generado para cobro ${cobroId}. Notificaciones en: ${process.env.NGROK_WEBHOOK_URL}`);
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

            const { cobroId, status } = response.data;
            //si el pago es aprobado, ordenamos actualizar el estado del cobro y del viaje
            if (status === 'approved') {
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

        // 2. Si el pago fue aprobado, notificamos al microservicio de Viaje
        if (status === 'approved') {
            // Necesitamos el cobro para obtener el viajeId asociado
            const cobro = await this.obtenerPorId(Number(cobroId));

            try {
                // Llamada interna al puerto 3004 del microservicio de Viaje para actualizar su estado
                if (cobro.tipo == 'senia') {
                    await firstValueFrom(
                        this.httpService.patch(`http://viaje-service:3004/viaje/${cobro.viajeId}/pago-senia`, {})
                    );
                    console.log(`🚀 Sincronización exitosa: Viaje ${cobro.viajeId} actualizado a PAGADO.`);
                }
                else if (cobro.tipo == 'resto') {
                    await firstValueFrom(
                        this.httpService.patch(`http://viaje-service:3004/viaje/${cobro.viajeId}/pago-resto`, {})
                    );
                    console.log(`🚀 Sincronización exitosa: Viaje ${cobro.viajeId} actualizado a PAGADO.`);
                }

            } catch (error) {
                console.error(`❌ Error de sincronización: No se pudo avisar al microservicio de Viaje. ${error.message}`);
            }
        }

        this.logger.log(`🔔 WEBHOOK PROCESADO: Cobro ${cobroId} actualizado a [${estadoFinal}]`);
        return { success: true };
    }
}