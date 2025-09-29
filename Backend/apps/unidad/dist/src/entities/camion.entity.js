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
exports.Camion = void 0;
const typeorm_1 = require("typeorm");
const estadoCamion_entity_1 = require("./estadoCamion.entity");
const tipoCamion_entity_1 = require("./tipoCamion.entity");
let Camion = class Camion {
};
exports.Camion = Camion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Camion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => estadoCamion_entity_1.EstadoCamion, { eager: true }),
    __metadata("design:type", estadoCamion_entity_1.EstadoCamion)
], Camion.prototype, "EstadoCamion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Camion.prototype, "patente", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => tipoCamion_entity_1.TipoCamion, { eager: true }),
    __metadata("design:type", tipoCamion_entity_1.TipoCamion)
], Camion.prototype, "tipoCamion", void 0);
exports.Camion = Camion = __decorate([
    (0, typeorm_1.Entity)("camion")
], Camion);
//# sourceMappingURL=camion.entity.js.map