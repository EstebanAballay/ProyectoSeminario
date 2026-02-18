"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CobroModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const cobro_controller_1 = require("./cobro.controller");
const webhook_controller_1 = require("./webhooks/webhook.controller");
const cobro_service_1 = require("./cobro.service");
const cobro_entity_1 = require("./entities/cobro.entity");
const estadoCobro_entity_1 = require("./entities/estadoCobro.entity");
const abonante_entity_1 = require("./entities/abonante.entity");
let CobroModule = class CobroModule {
};
exports.CobroModule = CobroModule;
exports.CobroModule = CobroModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([cobro_entity_1.Cobro, estadoCobro_entity_1.EstadoCobro, abonante_entity_1.Abonante]),
            axios_1.HttpModule,
        ],
        controllers: [
            cobro_controller_1.CobroController,
            webhook_controller_1.WebhookController,
        ],
        providers: [cobro_service_1.CobroService],
    })
], CobroModule);
