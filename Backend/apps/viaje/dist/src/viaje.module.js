"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViajeModule = void 0;
const common_1 = require("@nestjs/common");
const viaje_service_1 = require("./viaje.service");
const viaje_controller_1 = require("./viaje.controller");
const typeorm_1 = require("@nestjs/typeorm");
const viaje_entity_1 = require("./entities/viaje.entity");
const estadoViaje_entity_1 = require("./entities/estadoViaje.entity");
let ViajeModule = class ViajeModule {
};
exports.ViajeModule = ViajeModule;
exports.ViajeModule = ViajeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([viaje_entity_1.Viaje,
                estadoViaje_entity_1.EstadoViaje
            ])],
        controllers: [viaje_controller_1.ViajeController],
        providers: [viaje_service_1.ViajeService],
    })
], ViajeModule);
//# sourceMappingURL=viaje.module.js.map