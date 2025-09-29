"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnidadModule = void 0;
const common_1 = require("@nestjs/common");
const unidad_service_1 = require("./unidad.service");
const unidad_controller_1 = require("./unidad.controller");
const typeorm_1 = require("@nestjs/typeorm");
const unidad_entity_1 = require("./entities/unidad.entity");
const camion_entity_1 = require("./entities/camion.entity");
const acoplado_entity_1 = require("./entities/acoplado.entity");
const semirremolque_entity_1 = require("./entities/semirremolque.entity");
const estadoCamion_entity_1 = require("./entities/estadoCamion.entity");
const estadoAcoplado_entity_1 = require("./entities/estadoAcoplado.entity");
const estadoSemirremolque_entity_1 = require("./entities/estadoSemirremolque.entity");
const transportista_entity_1 = require("./entities/transportista.entity");
const estadoTransportista_entity_1 = require("./entities/estadoTransportista.entity");
const tipo_entity_1 = require("./entities/tipo.entity");
const tipoCamion_entity_1 = require("./entities/tipoCamion.entity");
const especializacion_entity_1 = require("./entities/especializacion.entity");
let UnidadModule = class UnidadModule {
};
exports.UnidadModule = UnidadModule;
exports.UnidadModule = UnidadModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                unidad_entity_1.Unidad,
                camion_entity_1.Camion,
                acoplado_entity_1.Acoplado,
                semirremolque_entity_1.Semirremolque,
                estadoCamion_entity_1.EstadoCamion,
                estadoAcoplado_entity_1.EstadoAcoplado,
                estadoSemirremolque_entity_1.EstadoSemirremolque,
                transportista_entity_1.Transportista,
                estadoTransportista_entity_1.estadoTransportista,
                tipo_entity_1.Tipo,
                tipoCamion_entity_1.TipoCamion,
                especializacion_entity_1.Especializacion,
            ]),
        ],
        controllers: [unidad_controller_1.UnidadController],
        providers: [unidad_service_1.UnidadService],
    })
], UnidadModule);
//# sourceMappingURL=unidad.module.js.map