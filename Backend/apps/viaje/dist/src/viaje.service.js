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
const constantesTiempoViaje_1 = require("../constantesTiempoViaje");
let ViajeService = class ViajeService {
    constructor(estadoViajeRepository, viajeRepository, httpService) {
        this.estadoViajeRepository = estadoViajeRepository;
        this.viajeRepository = viajeRepository;
        this.httpService = httpService;
    }
    async testConnection() {
        try {
            const count = await this.viajeRepository.count();
            console.log('✅ DB connection works, Viaje count:', count);
        }
        catch (error) {
            console.error('❌ DB connection failed:', error);
        }
    }
    async createViaje(data, user) {
        console.log('Creando viaje con datos:', data);
        let estadoDefault = await this.estadoViajeRepository.findOne({ where: { nombre: 'PreCargado' } });
        if (!estadoDefault) {
            estadoDefault = { id: 1 };
        }
        const { fecha, hora } = await this.calcularFechaRegreso(data.origenCoords, data.destinoCoords, constantesTiempoViaje_1.BASE_COORDS, data.fechaInicio, constantesTiempoViaje_1.TIEMPO_MUERTO);
        const viaje = this.viajeRepository.create({
            fechaReserva: new Date(),
            fechaInicio: new Date(data.fechaInicio),
            destinoInicio: data.destinoInicio,
            horaSalida: data.horaSalida.length === 5 ? `${data.horaSalida}:00` : data.horaSalida,
            fechaFin: fecha,
            horaLlegada: hora,
            destinoFin: data.destinoFin,
            sena: 0,
            resto: 0,
            total: 0,
            estadoViaje: estadoDefault,
            distancia: data.distancia,
            usuarioId: user.id,
            unidades: []
        });
        const savedViaje = await this.viajeRepository.save(viaje);
        if (data.unidades && data.unidades.length > 0) {
            for (const unidad of data.unidades) {
                const nuevaUnidad = await this.agregarUnidad(unidad, savedViaje.ViajeId);
                const subtotalCalculado = Math.trunc((nuevaUnidad.subtotal * data.distancia) * 100) / 100;
                savedViaje.unidades.push(nuevaUnidad.id);
                savedViaje.total += subtotalCalculado;
            }
        }
        savedViaje.sena = Math.trunc((savedViaje.total * 0.1) * 100) / 100;
        savedViaje.resto = Math.trunc((savedViaje.total - savedViaje.sena) * 100) / 100;
        await this.viajeRepository.save(savedViaje);
        return await this.viajeRepository.findOne({
            where: { ViajeId: savedViaje.ViajeId },
            relations: ['estadoViaje']
        });
    }
    async agregarUnidad(unidad, viajeId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://unidad-service:3002/unidad', { ...unidad, viajeId }));
            return { id: response.data.UnidadId, subtotal: response.data.subtotal };
        }
        catch (error) {
            console.error('Error al crear la unidad:', error.message);
            return { id: null, subtotal: 0 };
        }
    }
    async buscarUnidadesDisponibles(fechaInicio, fechaFin, camiones) {
        const viajesEnRango = await this.viajeRepository.find({
            where: [
                { fechaInicio: (0, typeorm_2.LessThanOrEqual)(fechaFin), fechaFin: (0, typeorm_2.MoreThanOrEqual)(fechaInicio) },
            ]
        });
        const unidadesOcupadas = viajesEnRango.flatMap(v => v.unidades || []);
        try {
            const dto = { unidadesOcupadas: unidadesOcupadas, camiones: camiones };
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://unidad-service:3002/unidad/unidadesDisponibles', dto));
            return response.data;
        }
        catch (error) {
            console.error('Error al buscar la unidad:', error.message);
            return [];
        }
    }
    async calcularFechaRegreso(origenCoords, destinoCoords, baseCoords, fechaInicio, tiempoMuerto) {
        const coords = `${baseCoords.lng},${baseCoords.lat};${origenCoords.lng},${origenCoords.lat};${destinoCoords.lng},${destinoCoords.lat};${baseCoords.lng},${baseCoords.lat}`;
        const url = `http://router.project-osrm.org/route/v1/driving/${coords}?overview=false`;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
            const duracionTransitoSegundos = response.data.routes[0].duration;
            const tiempoTotalSegundos = duracionTransitoSegundos + (tiempoMuerto * 3600);
            const fechaCompleta = new Date(new Date(fechaInicio).getTime() + (tiempoTotalSegundos * 1000));
            return {
                fecha: fechaCompleta.toISOString().split('T')[0],
                hora: fechaCompleta.toTimeString().split(' ')[0]
            };
        }
        catch (error) {
            console.error('Error calculando ruteo:', error);
            throw new Error('No se pudo calcular la fecha de regreso');
        }
    }
    async findAll(user) {
        await this.verificarYCancelarVencidos(user.id);
        return await this.viajeRepository.find({
            where: { usuarioId: user.id },
            relations: ['estadoViaje'],
            order: { ViajeId: 'DESC' }
        });
    }
    async verificarYCancelarVencidos(userId) {
        const ahora = new Date();
        const limite48hs = new Date(ahora.getTime() + (48 * 60 * 60 * 1000));
        const viajesVencidos = await this.viajeRepository.find({
            where: {
                usuarioId: userId,
                estadoViaje: { id: 1 },
                fechaInicio: (0, typeorm_2.LessThanOrEqual)(limite48hs)
            }
        });
        if (viajesVencidos.length > 0) {
            for (const v of viajesVencidos) {
                await this.viajeRepository.update(v.ViajeId, { estadoViaje: { id: 3 } });
            }
            console.log(`🚫 Sistema: Se cancelaron ${viajesVencidos.length} viajes.`);
        }
    }
    async confirmarPagoViaje(viajeId) {
        await this.viajeRepository.update(viajeId, {
            estadoViaje: { id: 2 }
        });
        console.log(`✅ Viaje ${viajeId} actualizado a estado: Confirmado`);
        return { success: true };
    }
    findOne(id) {
        return this.viajeRepository.findOne({ where: { ViajeId: id }, relations: ['estadoViaje'] });
    }
    remove(id) {
        return this.viajeRepository.delete(id);
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