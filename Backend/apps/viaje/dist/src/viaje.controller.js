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
exports.ViajeController = void 0;
const common_1 = require("@nestjs/common");
const viaje_service_1 = require("./viaje.service");
const create_viaje_dto_1 = require("./dto/create-viaje.dto");
const camiones_dto_1 = require("./dto/camiones.dto");
const get_user_decorator_1 = require("../decorators/get-user.decorator");
const auth_guard_1 = require("../viajeAuth/auth.guard");
let ViajeController = class ViajeController {
    constructor(viajeService) {
        this.viajeService = viajeService;
    }
    create(createViajeDto, user) {
        return this.viajeService.createViaje(createViajeDto, user);
    }
    findDisponibles(fechaInicio, fechaFin, camiones) {
        const inicio = fechaInicio ? new Date(fechaInicio) : undefined;
        const fin = fechaFin ? new Date(fechaFin) : undefined;
        console.log('Fechas recibidas:', inicio, fin);
        return this.viajeService.buscarUnidadesDisponibles(inicio, fin, camiones);
    }
    async getMisViajes(req) {
        return await this.viajeService.findAll(req.user);
    }
    findOne(id) {
        return this.viajeService.findOne(+id);
    }
    remove(id) {
        return this.viajeService.remove(+id);
    }
    async confirmarPago(id) {
        return this.viajeService.confirmarPagoViaje(+id);
    }
};
exports.ViajeController = ViajeController;
__decorate([
    (0, common_1.Post)('nuevoViaje'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_viaje_dto_1.CreateViajeDto, Object]),
    __metadata("design:returntype", Promise)
], ViajeController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('viajesRango'),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, camiones_dto_1.ConsultarUnidadesDto]),
    __metadata("design:returntype", void 0)
], ViajeController.prototype, "findDisponibles", null);
__decorate([
    (0, common_1.Get)('misViajes'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ViajeController.prototype, "getMisViajes", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ViajeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ViajeController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/confirmar-pago'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ViajeController.prototype, "confirmarPago", null);
exports.ViajeController = ViajeController = __decorate([
    (0, common_1.Controller)('viaje'),
    __metadata("design:paramtypes", [viaje_service_1.ViajeService])
], ViajeController);
//# sourceMappingURL=viaje.controller.js.map