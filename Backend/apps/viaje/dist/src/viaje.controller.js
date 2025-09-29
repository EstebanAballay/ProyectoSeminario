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
let ViajeController = class ViajeController {
    constructor(viajeService) {
        this.viajeService = viajeService;
    }
    create(createViajeDto) {
        return this.viajeService.createViaje(createViajeDto);
    }
    findAll() {
        return this.viajeService.findAll();
    }
    findOne(id) {
        return this.viajeService.findOne(+id);
    }
    remove(id) {
        return this.viajeService.remove(+id);
    }
};
exports.ViajeController = ViajeController;
__decorate([
    (0, common_1.Post)('nuevoViaje'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_viaje_dto_1.CreateViajeDto]),
    __metadata("design:returntype", Promise)
], ViajeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ViajeController.prototype, "findAll", null);
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
exports.ViajeController = ViajeController = __decorate([
    (0, common_1.Controller)('viaje'),
    __metadata("design:paramtypes", [viaje_service_1.ViajeService])
], ViajeController);
//# sourceMappingURL=viaje.controller.js.map