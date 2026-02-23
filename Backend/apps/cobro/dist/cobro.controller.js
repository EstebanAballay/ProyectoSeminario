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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CobroController = void 0;
const common_1 = require("@nestjs/common");
const cobro_service_1 = require("./cobro.service");
const create_cobro_dto_1 = require("./entities/create-cobro-dto");
const auth_guard_1 = require("./cobroAuth/auth.guard");
let CobroController = class CobroController {
    constructor(cobroService) {
        this.cobroService = cobroService;
    }
    /* El front el ordena a este servicio crear el cobro,luego le ordena generar el link de pago,
    y cuando el cliente paga hay un webhook(puerto que conecta nuestro localhost con internet) que esta
    escuchando la notificacion de mp,es notificacion contiene el id de la transaccion de mp,es en ese momento que llama
    a verificar y confirmar pago, y si es positiva, ordena cambiar el estado del cobro y el viaje.
    */
    async consultarCobrosUsuario(req) {
        return await this.cobroService.consultarCobrosUsuario(req.user);
    }
    // 1. CREAR COBRO: POST http://localhost:3001/cobros
    async crearCobro(createCobroDto) {
        console.log(createCobroDto);
        return await this.cobroService.crearCobro(createCobroDto);
    }
    // 2. CONSULTAR: GET http://localhost:3001/cobros/25
    async obtenerEstado(id) {
        return await this.cobroService.obtenerPorId(id);
    }
    // 3. PAGAR: POST http://localhost:3001/cobros/25/pagar
    async pagar(id) {
        return await this.cobroService.generarPagoMP(id);
    }
    async descargarFactura(id, res) {
        return this.cobroService.descargarFacturaCobro(+id, res);
    }
};
exports.CobroController = CobroController;
__decorate([
    (0, common_1.Get)('/consultar-cobros-usuario'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CobroController.prototype, "consultarCobrosUsuario", null);
__decorate([
    (0, common_1.Post)(''),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cobro_dto_1.CreateCobroDto]),
    __metadata("design:returntype", Promise)
], CobroController.prototype, "crearCobro", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CobroController.prototype, "obtenerEstado", null);
__decorate([
    (0, common_1.Post)(':id/pagar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CobroController.prototype, "pagar", null);
__decorate([
    (0, common_1.Get)(':id/factura'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CobroController.prototype, "descargarFactura", null);
exports.CobroController = CobroController = __decorate([
    (0, common_1.Controller)('cobros') // Esta es la base: http://localhost:3001/cobros
    ,
    __metadata("design:paramtypes", [cobro_service_1.CobroService])
], CobroController);
