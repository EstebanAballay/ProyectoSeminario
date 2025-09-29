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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unidad = void 0;
const typeorm_1 = require("typeorm");
const camion_entity_1 = require("./camion.entity");
const semirremolque_entity_1 = require("./semirremolque.entity");
const acoplado_entity_1 = require("./acoplado.entity");
const transportista_entity_1 = require("./transportista.entity");
let Unidad = class Unidad {
};
exports.Unidad = Unidad;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Unidad.prototype, "idViaje", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => camion_entity_1.Camion, { eager: true }),
    __metadata("design:type", camion_entity_1.Camion)
], Unidad.prototype, "Camion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => semirremolque_entity_1.Semirremolque, { eager: true }),
    __metadata("design:type", semirremolque_entity_1.Semirremolque)
], Unidad.prototype, "semiremolque", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => acoplado_entity_1.Acoplado, { eager: true }),
    __metadata("design:type", acoplado_entity_1.Acoplado)
], Unidad.prototype, "acoplado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => transportista_entity_1.Transportista, { eager: true }),
    __metadata("design:type", transportista_entity_1.Transportista)
], Unidad.prototype, "transportista", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Unidad.prototype, "subtotal", void 0);
exports.Unidad = Unidad = __decorate([
    (0, typeorm_1.Entity)('unidad')
], Unidad);
//# sourceMappingURL=unidad.entity.js.map