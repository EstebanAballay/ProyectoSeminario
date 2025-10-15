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
exports.ViajeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const estadoViaje_entity_1 = require("./entities/estadoViaje.entity");
const viaje_entity_1 = require("./entities/viaje.entity");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let ViajeService = class ViajeService {
    constructor(estadoViajeRepository, viajeRepository, httpService) {
        this.estadoViajeRepository = estadoViajeRepository;
        this.viajeRepository = viajeRepository;
        this.httpService = httpService;
    }
    async testConnection() {
        try {
            const count = await this.viajeRepository.count();
            console.log('DB connection works, Viaje count:', count);
        }
        catch (error) {
            console.error('DB connection failed:', error);
        }
    }
    async createViaje(data) {
        const estadoDefault = await this.estadoViajeRepository.findOne({ where: { nombre: 'PreCargado' } });
        const viaje = this.viajeRepository.create({
            fechaReserva: new Date(),
            fechaInicio: new Date(data.fechaInicio),
            destinoInicio: data.destinoInicio,
            horaSalida: data.horaSalida,
            fechaFin: new Date(data.fechaFin),
            horaLlegada: data.horaLlegada,
            destinoFin: data.destinoFin,
            sena: 0,
            resto: 0,
            total: 0,
            estadoViaje: estadoDefault
        });
        const savedViaje = await this.viajeRepository.save(viaje);
        const unidades = data.unidades;
        for (const unidad of unidades) {
            await this.agregarUnidad(unidad, savedViaje.ViajeId);
        }
        return savedViaje;
    }
    async agregarUnidad(unidad, viajeId) {
        const unidadCompleta = { ...unidad, viajeId };
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://unidad-service:3002/unidad', unidadCompleta));
            console.log('Unidad creada:', response.data);
            return response.data;
        }
        catch (error) {
            console.error('Error al crear la unidad:', error.message);
        }
    }
    findAll() {
        return `This action returns all viaje`;
    }
    findOne(id) {
        return `This action returns a #${id} viaje`;
    }
    remove(id) {
        return `This action removes a #${id} viaje`;
    }
};
exports.ViajeService = ViajeService;
exports.ViajeService = ViajeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(estadoViaje_entity_1.EstadoViaje)),
    __param(1, (0, typeorm_1.InjectRepository)(viaje_entity_1.Viaje)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        axios_1.HttpService])
], ViajeService);
//# sourceMappingURL=viaje.service.js.map