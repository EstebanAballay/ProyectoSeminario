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
    findDisponibles(fechaInicio, dtoViaje) {
        const inicio = fechaInicio ? new Date(fechaInicio) : undefined;
        console.log('Fechas recibidas:', inicio);
        return this.viajeService.buscarUnidadesDisponibles(inicio, dtoViaje);
    }
    findAll(user) {
        return this.viajeService.buscarTodos(user);
    }
    async getMisViajes(req) {
        return await this.viajeService.consultarViajesCliente(req.user);
    }
    findAllAdmin() {
        return this.viajeService.getViajesPendientes();
    }
    async getChoferesDisponibles(desde, hasta) {
        if (!desde || !hasta) {
            throw new common_1.BadRequestException('Las fechas "desde" y "hasta" son obligatorias');
        }
        ;
        const fechaInicio = new Date(desde);
        const fechaFin = new Date(hasta);
        return this.viajeService.getChoferesDisponibles(fechaInicio, fechaFin);
    }
    async asignarChoferes(dto) {
        return this.viajeService.asignarChoferes(dto.viajeId, dto.asignaciones);
    }
    async getViajesPorPagar(user) {
        return await this.viajeService.getViajesPendientesPago(user);
    }
    async obtenerViajesPorIds(idsString) {
        if (!idsString) {
            return [];
        }
        const idsArray = idsString
            .split(',')
            .map((id) => parseInt(id.trim(), 10))
            .filter((id) => !isNaN(id));
        return this.viajeService.buscarPorMultiplesIds(idsArray);
    }
    async rechazarViaje(id) {
        return this.viajeService.rechazarViaje(id);
    }
    findOne(id) {
        return this.viajeService.findOne(id);
    }
    findViajeXUnidad(id) {
        return this.viajeService.findViajeXUnidad(id);
    }
    remove(id) {
        return this.viajeService.remove(+id);
    }
    finalizar(id) {
        return this.viajeService.finalizarViaje(id);
    }
    iniciar(id) {
        return this.viajeService.enViaje(id);
    }
    cancelar(id) {
        return this.viajeService.cancelarViaje(id);
    }
    async confirmarPagoSenia(id) {
        return this.viajeService.confirmarPagoViajeSenia(+id);
    }
    async confirmarPagResto(id) {
        return this.viajeService.confirmarPagoViajeResto(+id);
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
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, camiones_dto_1.ConsultarUnidadesDto]),
    __metadata("design:returntype", void 0)
], ViajeController.prototype, "findDisponibles", null);
__decorate([
    (0, common_1.Get)('misViajes'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ViajeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('viajesCliente'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ViajeController.prototype, "getMisViajes", null);
__decorate([
    (0, common_1.Get)('viajesPendientes'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ViajeController.prototype, "findAllAdmin", null);
__decorate([
    (0, common_1.Get)('choferesDisponibles'),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date]),
    __metadata("design:returntype", Promise)
], ViajeController.prototype, "getChoferesDisponibles", null);
__decorate([
    (0, common_1.Post)('asignarChoferes'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ViajeController.prototype, "asignarChoferes", null);
__decorate([
    (0, common_1.Get)('viajesPorPagar'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ViajeController.prototype, "getViajesPorPagar", null);
__decorate([
    (0, common_1.Get)('por-ids'),
    __param(0, (0, common_1.Query)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ViajeController.prototype, "obtenerViajesPorIds", null);
__decorate([
    (0, common_1.Patch)('rechazarViaje/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ViajeController.prototype, "rechazarViaje", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ViajeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('/viaje-con-unidades/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ViajeController.prototype, "findViajeXUnidad", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ViajeController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)('finalizar/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ViajeController.prototype, "finalizar", null);
__decorate([
    (0, common_1.Patch)('iniciar/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ViajeController.prototype, "iniciar", null);
__decorate([
    (0, common_1.Patch)('cancelar/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ViajeController.prototype, "cancelar", null);
__decorate([
    (0, common_1.Patch)(':id/pago-senia'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ViajeController.prototype, "confirmarPagoSenia", null);
__decorate([
    (0, common_1.Patch)(':id/pago-resto'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ViajeController.prototype, "confirmarPagResto", null);
exports.ViajeController = ViajeController = __decorate([
    (0, common_1.Controller)('viaje'),
    __metadata("design:paramtypes", [viaje_service_1.ViajeService])
], ViajeController);
//# sourceMappingURL=viaje.controller.js.map