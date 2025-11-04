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
exports.UnidadController = void 0;
const common_1 = require("@nestjs/common");
const unidad_service_1 = require("./unidad.service");
const create_unidad_dto_1 = require("./dto/create-unidad.dto");
const update_unidad_dto_1 = require("./dto/update-unidad.dto");
const datosUnidadesFront_dto_1 = require("./dto/datosUnidadesFront.dto");
let UnidadController = class UnidadController {
    constructor(unidadService) {
        this.unidadService = unidadService;
    }
    create(createUnidadDto) {
        return this.unidadService.createUnidad(createUnidadDto);
    }
    consultarTiposAcoplados() {
        return this.unidadService.consultarTiposAcoplados();
    }
    consultarTiposCamiones() {
        return this.unidadService.consultarTiposCamiones();
    }
    async consultarUnidadesDisponibles(dto) {
        const disponiblesPorFecha = await this.unidadService.findDisponibles(dto.unidadesOcupadas);
        console.log('Unidades disponibles por fecha:', disponiblesPorFecha);
        return this.unidadService.findUnidadesDisponiblesByTipoRandom(dto.camiones, disponiblesPorFecha);
    }
    findOne(id) {
        return this.unidadService.findOne(+id);
    }
    update(id, updateUnidadDto) {
        return this.unidadService.update(+id, updateUnidadDto);
    }
    remove(id) {
        return this.unidadService.remove(+id);
    }
};
exports.UnidadController = UnidadController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_unidad_dto_1.CreateUnidadDto]),
    __metadata("design:returntype", Promise)
], UnidadController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('tiposAcoplados'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UnidadController.prototype, "consultarTiposAcoplados", null);
__decorate([
    (0, common_1.Get)('tiposCamiones'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UnidadController.prototype, "consultarTiposCamiones", null);
__decorate([
    (0, common_1.Post)('unidadesDisponibles'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [datosUnidadesFront_dto_1.ConsultarUnidadesDto]),
    __metadata("design:returntype", Promise)
], UnidadController.prototype, "consultarUnidadesDisponibles", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UnidadController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_unidad_dto_1.UpdateUnidadDto]),
    __metadata("design:returntype", void 0)
], UnidadController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UnidadController.prototype, "remove", null);
exports.UnidadController = UnidadController = __decorate([
    (0, common_1.Controller)('unidad'),
    __metadata("design:paramtypes", [unidad_service_1.UnidadService])
], UnidadController);
//# sourceMappingURL=unidad.controller.js.map