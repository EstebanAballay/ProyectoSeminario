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
var WebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const cobro_service_1 = require("../cobro.service");
let WebhookController = WebhookController_1 = class WebhookController {
    constructor(cobroService) {
        this.cobroService = cobroService;
        this.logger = new common_1.Logger(WebhookController_1.name);
    }
    async handleMercadoPagoWebhook(paymentId, type, body) {
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
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.Post)('mercadopago'),
    __param(0, (0, common_1.Query)('data.id')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleMercadoPagoWebhook", null);
exports.WebhookController = WebhookController = WebhookController_1 = __decorate([
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [cobro_service_1.CobroService])
], WebhookController);
