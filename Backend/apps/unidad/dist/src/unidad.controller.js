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
const create_Vehicle_dto_1 = require("./dto/create-Vehicle.dto");
let UnidadController = class UnidadController {
    constructor(unidadService) {
        this.unidadService = unidadService;
    }
    create(createUnidadDto) {
        return this.unidadService.createUnidad(createUnidadDto);
    }
    finndAll() {
        return this.unidadService.findAll();
    }
    async findAll(id) {
        return this.unidadService.findUnityByDriver(Number(id));
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
        const disponiblesPorTipo = this.unidadService.findUnidadesDisponiblesByTipoRandom(dto.camiones, disponiblesPorFecha);
        console.log('Unidades disponibles por tipo:', disponiblesPorTipo);
        return disponiblesPorTipo;
    }
<<<<<<< HEAD
    async getChoferesDisponibles(dto) {
        const disponibles = await this.unidadService.getChoferesDisponibles(dto.idViajesEnRango);
        console.log('Choferes disponibles:', disponibles);
        return disponibles;
    }
    async buscarUnidades(idViaje) {
        if (idViaje) {
            return this.unidadService.findOne(idViaje);
        }
        return this.unidadService.findAll();
    }
    async asignarChoferes(dto) {
        console.log('Asignaciones recibidas:', dto.asignaciones);
        return await this.unidadService.asignarChoferes(dto.asignaciones);
=======
    async iniciarEstadoViaje(id) {
        return this.unidadService.iniciarEstadoViaje(id);
    }
    async finalizarEstadoViaje(id) {
        return this.unidadService.finalizarEstadoViaje(id);
    }
    findOne(id) {
        return this.unidadService.findOne(+id);
>>>>>>> origin/cambiosChofer
    }
    update(id, updateUnidadDto) {
        return this.unidadService.update(+id, updateUnidadDto);
    }
    remove(id) {
        return this.unidadService.remove(+id);
    }
    async crearUnidad(createUnidadDto) {
        return await this.unidadService.createVehicle(createUnidadDto);
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
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], UnidadController.prototype, "finndAll", null);
__decorate([
    (0, common_1.Get)(':id/'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnidadController.prototype, "findAll", null);
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
<<<<<<< HEAD
    (0, common_1.Post)('choferesDisponibles'),
    __param(0, (0, common_1.Body)()),
=======
    (0, common_1.Patch)('iniciarEstadoViaje/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UnidadController.prototype, "iniciarEstadoViaje", null);
__decorate([
    (0, common_1.Patch)('finalizarEstadoViaje/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UnidadController.prototype, "finalizarEstadoViaje", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
>>>>>>> origin/cambiosChofer
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UnidadController.prototype, "getChoferesDisponibles", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('idViaje')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UnidadController.prototype, "buscarUnidades", null);
__decorate([
    (0, common_1.Post)('asignarChoferes'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UnidadController.prototype, "asignarChoferes", null);
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
__decorate([
    (0, common_1.Post)('nuevaUnidad'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_Vehicle_dto_1.CreateVehicleDto]),
    __metadata("design:returntype", Promise)
], UnidadController.prototype, "crearUnidad", null);
exports.UnidadController = UnidadController = __decorate([
    (0, common_1.Controller)('unidad'),
    __metadata("design:paramtypes", [unidad_service_1.UnidadService])
], UnidadController);
//# sourceMappingURL=unidad.controller.js.map