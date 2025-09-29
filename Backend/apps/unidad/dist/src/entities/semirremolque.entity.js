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
exports.Semirremolque = void 0;
const typeorm_1 = require("typeorm");
const estadoSemirremolque_entity_1 = require("./estadoSemirremolque.entity");
const tipo_entity_1 = require("./tipo.entity");
let Semirremolque = class Semirremolque {
};
exports.Semirremolque = Semirremolque;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Semirremolque.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Semirremolque.prototype, "cantidadDeEjes", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Semirremolque.prototype, "patente", void 0);
__decorate([
    (0, typeorm_1.Column)("float"),
    __metadata("design:type", Number)
], Semirremolque.prototype, "capacidad", void 0);
__decorate([
    (0, typeorm_1.Column)("float"),
    __metadata("design:type", Number)
], Semirremolque.prototype, "precio", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estadoSemirremolque_entity_1.EstadoSemirremolque, { eager: true }),
    __metadata("design:type", estadoSemirremolque_entity_1.EstadoSemirremolque)
], Semirremolque.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tipo_entity_1.Tipo, { eager: true }),
    __metadata("design:type", tipo_entity_1.Tipo)
], Semirremolque.prototype, "tipo", void 0);
exports.Semirremolque = Semirremolque = __decorate([
    (0, typeorm_1.Entity)("semirremolque")
], Semirremolque);
//# sourceMappingURL=semirremolque.entity.js.map