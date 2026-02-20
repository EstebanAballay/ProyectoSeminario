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
let CobroService = CobroService_1 = class CobroService {
    constructor(cobroRepo, httpService) {
        this.cobroRepo = cobroRepo;
        this.httpService = httpService;
        this.logger = new common_1.Logger(CobroService_1.name);
    }
    /**
     * Crea el registro inicial en Supabase.
     */
    async crearCobro(data) {
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
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${process.env.MP_SERVICE_URL}/mercadopago/create`, {
                cobroId: cobro.id,
                monto: cobro.monto,
                // Usamos la URL completa definida en tu .env para el túnel de Ngrok
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
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${process.env.MP_SERVICE_URL}/mercadopago/verificar/${paymentId}`));
            const { cobroId, status } = response.data;
            if (status === 'approved') {
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
        const estadoFinal = status === 'approved' ? 'pagado' : 'rechazado';
        // 1. Actualizamos el registro de cobro en la tabla 'cobro' de Supabase
        await this.cobroRepo.update({ id: Number(cobroId) }, { estado: estadoFinal, transactionId: paymentId });
        console.log(`💰 Cobro ${cobroId} actualizado a ${estadoFinal} en base de datos.`);
        // 2. Si el pago fue aprobado, notificamos al microservicio de Viaje
        if (status === 'approved') {
            // Necesitamos el cobro para obtener el viajeId asociado
            const cobro = await this.obtenerPorId(Number(cobroId));
            try {
                // Llamada interna al puerto 3004 del microservicio de Viaje
                await (0, rxjs_1.firstValueFrom)(this.httpService.patch(`http://viaje-service:3004/viaje/${cobro.viajeId}/confirmar-pago`, {}));
                console.log(`🚀 Sincronización exitosa: Viaje ${cobro.viajeId} actualizado a PAGADO.`);
            }
            catch (error) {
                console.error(`❌ Error de sincronización: No se pudo avisar al microservicio de Viaje. ${error.message}`);
            }
        }
        this.logger.log(`🔔 WEBHOOK PROCESADO: Cobro ${cobroId} actualizado a [${estadoFinal}]`);
        return { success: true };
    }
};
exports.CobroService = CobroService;
exports.CobroService = CobroService = CobroService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cobro_entity_1.Cobro)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        axios_1.HttpService])
], CobroService);
