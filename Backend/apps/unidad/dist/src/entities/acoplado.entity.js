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
exports.Acoplado = void 0;
const typeorm_1 = require("typeorm");
const estadoAcoplado_entity_1 = require("./estadoAcoplado.entity");
const tipo_entity_1 = require("./tipo.entity");
let Acoplado = class Acoplado {
};
exports.Acoplado = Acoplado;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Acoplado.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Acoplado.prototype, "patente", void 0);
__decorate([
    (0, typeorm_1.Column)("float"),
    __metadata("design:type", Number)
], Acoplado.prototype, "capacidad", void 0);
__decorate([
    (0, typeorm_1.Column)("float"),
    __metadata("design:type", Number)
], Acoplado.prototype, "precio", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Acoplado.prototype, "cantidadDeEjes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estadoAcoplado_entity_1.EstadoAcoplado, { eager: true }),
    __metadata("design:type", estadoAcoplado_entity_1.EstadoAcoplado)
], Acoplado.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tipo_entity_1.Tipo, { eager: true }),
    __metadata("design:type", tipo_entity_1.Tipo)
], Acoplado.prototype, "tipo", void 0);
exports.Acoplado = Acoplado = __decorate([
    (0, typeorm_1.Entity)({ name: "acoplado", schema: 'microservice_unidad' })
], Acoplado);
//# sourceMappingURL=acoplado.entity.js.map