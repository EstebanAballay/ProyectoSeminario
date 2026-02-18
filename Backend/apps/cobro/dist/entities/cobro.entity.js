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
exports.Cobro = exports.tipoCobro = void 0;
const typeorm_1 = require("typeorm");
const estadoCobro_entity_1 = require("./estadoCobro.entity");
const abonante_entity_1 = require("./abonante.entity");
var tipoCobro;
(function (tipoCobro) {
    tipoCobro["SENIA"] = "senia";
    tipoCobro["RESTO"] = "resto";
})(tipoCobro || (exports.tipoCobro = tipoCobro = {}));
let Cobro = class Cobro {
};
exports.Cobro = Cobro;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Cobro.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Cobro.prototype, "viajeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric' }),
    __metadata("design:type", Number)
], Cobro.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estadoCobro_entity_1.EstadoCobro, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'estadoId' }),
    __metadata("design:type", estadoCobro_entity_1.EstadoCobro)
], Cobro.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Cobro.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Cobro.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: tipoCobro, default: tipoCobro.SENIA }),
    __metadata("design:type", String)
], Cobro.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => abonante_entity_1.Abonante, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'abonanteId' }),
    __metadata("design:type", abonante_entity_1.Abonante)
], Cobro.prototype, "abonante", void 0);
exports.Cobro = Cobro = __decorate([
    (0, typeorm_1.Entity)({ name: 'cobro', schema: 'microservice_cobro' })
], Cobro);
