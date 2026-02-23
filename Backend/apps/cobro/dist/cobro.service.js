"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CobroService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CobroService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const cobro_entity_1 = require("./entities/cobro.entity");
const estadoCobro_entity_1 = require("./entities/estadoCobro.entity");
const abonante_entity_1 = require("./entities/abonante.entity");
const billing_service_1 = require("./billing.service");
const fs = require("fs");
const path = require("path");
let CobroService = CobroService_1 = class CobroService {
    constructor(cobroRepo, estadoRepo, abonanteRepo, httpService, billingService) {
        this.cobroRepo = cobroRepo;
        this.estadoRepo = estadoRepo;
        this.abonanteRepo = abonanteRepo;
        this.httpService = httpService;
        this.billingService = billingService;
        this.logger = new common_1.Logger(CobroService_1.name);
    }
    /**
     * Crea el registro inicial en Supabase.
     */
    async crearCobro(dto) {
        console.log(dto);
        //para asegurar que el cliente no modifico el monto de la senia, pido al service de viaje que me envie el viaje seguro
        const viajeSeguro = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://viaje-service:3004/viaje/${Number(dto.viajeId)}`));
        //verifico si el cobro es una senia o un resto segun lo que me venga del dto y genero el cobro con el monto correspondiente
        let montoACobrar = 0;
        switch (dto.tipo) {
            case cobro_entity_1.tipoCobro.SENIA:
                montoACobrar = viajeSeguro.data.sena;
                break;
            case cobro_entity_1.tipoCobro.RESTO:
                montoACobrar = viajeSeguro.data.resto;
                break;
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
    async obtenerPorId(id) {
        const cobro = await this.cobroRepo.findOne({ where: { id } });
        if (!cobro) {
            throw new common_1.NotFoundException(`El cobro con ID ${id} no existe.`);
        }
        return cobro;
    }
    /**
     * Genera el link de pago real usando el microservicio de MP y Ngrok.
     */
    async generarPagoMP(cobroId) {
        const cobro = await this.obtenerPorId(cobroId);
        console.log("estoy intentando generar el link de pago,afuera del try");
        try {
            console.log("estoy intentando generar el link de pago");
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${process.env.MP_SERVICE_URL}/mercadopago/create`, {
                cobroId: cobro.id,
                monto: cobro.monto,
                // Usamos la URL completa definida en el .env para el túnel de Ngrok
                notificationUrl: process.env.NGROK_WEBHOOK_URL
            }));
            this.logger.log(`⏳ Link generado para cobro ${cobroId}. Notificaciones en: ${process.env.NGROK_WEBHOOK_URL}`);
            return response.data; // Retorna el init_point para el navegador
        }
        catch (error) {
            this.logger.error(`❌ Error al conectar con MP-Service: ${error.message}`);
            throw error;
        }
    }
    /**
     * Consulta al microservicio de MP los detalles para obtener el cobroId real
     * y confirmar la transacción en Supabase tras el aviso de Ngrok.
     */
    async verificarYConfirmarPago(paymentId) {
        try {
            //le pregutnamos a mp si el pago fue hecho
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${process.env.MP_SERVICE_URL}/mercadopago/verificar/${paymentId}`));
            console.log('la devolucion del payer de mp es:', response.data.payer);
            const payer = response.data.payer;
            //creamos el abonante cuando recibimos sus datos
            const nuevoAbonante = this.abonanteRepo.create({
                nombre: payer.nombre,
                apellido: payer.apellido,
                numeroDocumento: payer.numeroDocumento,
                tipoDocumento: payer.tipoDocumento,
                email: payer.email,
                telefono: payer.telefono
            });
            const guardado = await this.abonanteRepo.save(nuevoAbonante);
            console.log('el abonante guardado es este:', nuevoAbonante);
            const { cobroId, status } = response.data;
            //asignamos al abonante al cobro creado anteriormente. Hay que pasarlo un objeto,sino usar .save pero es mas lento
            const cobroEncontrado = await this.cobroRepo.findOne({ where: { id: cobroId } });
            console.log(cobroEncontrado);
            //si el pago es aprobado, ordenamos actualizar el estado del cobro y del viaje
            if (status === 'approved') {
                console.log('el payment id de mp es:', paymentId);
                await this.cobroRepo.update({ id: cobroId }, { abonante: { id: guardado.id } });
                await this.confirmarPagoMP(cobroId, status, paymentId);
            }
        }
        catch (error) {
            this.logger.error(`Error verificando pago ${paymentId}: ${error.message}`);
        }
    }
    /**
     * Impacta el cambio de estado en la base de datos de Supabase.
     */
    async confirmarPagoMP(cobroId, status, paymentId) {
        //nombre de los estados 
        const estadoFinal = status === 'approved' ? 'pagado' : 'rechazado';
        //busco el estado final por su nombre
        const estadoEntity = await this.estadoRepo.findOne({ where: { nombre: estadoFinal } });
        //actualizamos el estado del cobro
        await this.cobroRepo.update({ id: Number(cobroId) }, {
            estado: estadoEntity,
            transactionId: paymentId
        });
        console.log(`💰 Cobro ${cobroId} actualizado a ${estadoFinal} en base de datos.`);
        // Si el pago fue aprobado, notificamos al microservicio de Viaje
        if (status === 'approved') {
            // Necesitamos el cobro para obtener el viajeId asociado
            const cobro = await this.obtenerPorId(Number(cobroId));
            try {
                // Llamada interna al puerto 3004 del microservicio de Viaje para actualizar su estado
                if (cobro.tipo == 'senia') {
                    await (0, rxjs_1.firstValueFrom)(this.httpService.patch(`http://viaje-service:3004/viaje/${cobro.viajeId}/pago-senia`, {}));
                    try {
                        await this.generarPdf(Number(cobroId), cobro.viajeId);
                    }
                    catch (error) {
                        console.log('error al generar el pdf', error);
                    }
                    console.log(`🚀 Sincronización exitosa: Viaje ${cobro.viajeId} actualizado a PAGADO.`);
                }
                else if (cobro.tipo == 'resto') {
                    await (0, rxjs_1.firstValueFrom)(this.httpService.patch(`http://viaje-service:3004/viaje/${cobro.viajeId}/pago-resto`, {}));
                    try {
                        await this.generarPdf(Number(cobroId), cobro.viajeId);
                    }
                    catch (error) {
                        console.log('error al generar el pdf', error);
                    }
                    console.log(`🚀 Sincronización exitosa: Viaje ${cobro.viajeId} actualizado a PAGADO.`);
                }
            }
            catch (error) {
                console.error(`❌ Error de sincronización: No se pudo avisar al microservicio de Viaje. ${error.message}`);
            }
        }
        this.logger.log(`🔔 WEBHOOK PROCESADO: Cobro ${cobroId} actualizado a [${estadoFinal}]`);
        return { success: true };
    }
    async generarPdf(cobroId, viajeId) {
        const pdfBuffer = await this.billingService.generarFactura(Number(cobroId), viajeId);
        return pdfBuffer;
    }
    async consultarCobrosUsuario(user) {
        const estadoPagado = await this.estadoRepo.findOne({ where: { id: 2 } });
        const cobros = await this.cobroRepo.find({ where: { abonante: user.id, estado: estadoPagado } });
        if (cobros.length === 0) {
            return [];
        }
        const idViajes = cobros.map((cobro) => cobro.viajeId);
        // 1. Convertimos el array de IDs en un string separado por comas (Ej: "14,25,8")
        const idsQuery = idViajes.join(',');
        // 2. Hacemos la petición GET al microservicio de Viajes. 
        // (Ajustá el puerto y la ruta según cómo lo tengan configurado)
        const urlViajes = `http://viaje-service:3004/viaje/por-ids?ids=${idsQuery}`;
        // Usamos firstValueFrom para esperar la respuesta HTTP
        const respuestaHttp = await (0, rxjs_1.firstValueFrom)(this.httpService.get(urlViajes));
        const viajes = respuestaHttp.data;
        // 3. Combinamos los datos: a cada cobro le adjuntamos la información de su viaje
        const cobrosCompletos = cobros.map(cobro => {
            const viajeAsociado = viajes.find((v) => v.ViajeId === cobro.viajeId);
            return {
                ...cobro,
                viaje: viajeAsociado // Adjuntamos el objeto viaje completo
            };
        });
        return cobrosCompletos;
    }
    async descargarFacturaCobro(id, res) {
        console.log('intentando descargar factura');
        // 1. Buscamos el cobro para saber el viajeId (necesario para el nombre del archivo)
        const cobro = await this.cobroRepo.findOne({ where: { id: id } });
        // 2. Reconstruimos el nombre exacto con el que lo guardó el billing.service
        const nombreArchivo = `Factura_Viaje${cobro.viajeId}_Cobro${cobro.id}.pdf`;
        // 3. Calculamos la ruta. Ojo aquí: desde dist/apps/cobro hay que subir un par de niveles
        const dirFacturas = path.join(__dirname, '..', 'Facturas');
        const rutaDestino = path.join(dirFacturas, nombreArchivo);
        // 4. Verificamos si Puppeteer ya terminó de crear el archivo
        if (!fs.existsSync(rutaDestino)) {
            throw new common_1.NotFoundException('La factura aún se está generando. Por favor, aguarde unos segundos y vuelva a intentar.');
        }
        // 5. Configuramos las cabeceras para forzar la descarga en el navegador
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="Factura_Transporte_Grafo_N${cobro.id}.pdf"`,
        });
        // 6. Enviamos el archivo como un stream
        const fileStream = fs.createReadStream(rutaDestino);
        fileStream.pipe(res);
    }
};
exports.CobroService = CobroService;
exports.CobroService = CobroService = CobroService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cobro_entity_1.Cobro)),
    __param(1, (0, typeorm_1.InjectRepository)(estadoCobro_entity_1.EstadoCobro)),
    __param(2, (0, typeorm_1.InjectRepository)(abonante_entity_1.Abonante)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        axios_1.HttpService,
        billing_service_1.BillingService])
], CobroService);
