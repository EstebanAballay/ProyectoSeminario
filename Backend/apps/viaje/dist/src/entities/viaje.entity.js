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
exports.Viaje = void 0;
const typeorm_1 = require("typeorm");
const typeorm_2 = require("typeorm");
const estadoViaje_entity_1 = require("./estadoViaje.entity");
let Viaje = class Viaje {
    constructor() {
        this.unidades = [];
    }
};
exports.Viaje = Viaje;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Viaje.prototype, "ViajeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Viaje.prototype, "fechaReserva", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Viaje.prototype, "fechaInicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Viaje.prototype, "fechaFin", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Viaje.prototype, "destinoInicio", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Viaje.prototype, "destinoFin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Viaje.prototype, "horaSalida", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Viaje.prototype, "horaLlegada", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric' }),
    __metadata("design:type", Number)
], Viaje.prototype, "sena", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric' }),
    __metadata("design:type", Number)
], Viaje.prototype, "resto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric' }),
    __metadata("design:type", Number)
], Viaje.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], Viaje.prototype, "distancia", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb", { nullable: true }),
    __metadata("design:type", Array)
], Viaje.prototype, "unidades", void 0);
__decorate([
    (0, typeorm_2.ManyToOne)(() => estadoViaje_entity_1.EstadoViaje, (estado) => estado.viajes, { eager: true }),
    (0, typeorm_2.JoinColumn)({ name: 'estadoViajeId' }),
    __metadata("design:type", estadoViaje_entity_1.EstadoViaje)
], Viaje.prototype, "estadoViaje", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Viaje.prototype, "usuarioId", void 0);
exports.Viaje = Viaje = __decorate([
    (0, typeorm_1.Entity)({ name: 'viaje', schema: 'microservice_viaje' })
], Viaje);
//# sourceMappingURL=viaje.entity.js.map