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
exports.UnidadService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const typeorm_1 = require("@nestjs/typeorm");
const semirremolque_entity_1 = require("./entities/semirremolque.entity");
const acoplado_entity_1 = require("./entities/acoplado.entity");
const typeorm_2 = require("typeorm");
const tipo_entity_1 = require("./entities/tipo.entity");
const tipoCamion_entity_1 = require("./entities/tipoCamion.entity");
const camion_entity_1 = require("./entities/camion.entity");
const unidad_entity_1 = require("./entities/unidad.entity");
const typeorm_3 = require("typeorm");
const transportista_entity_1 = require("./entities/transportista.entity");
const rxjs_1 = require("rxjs");
const estadoCamion_entity_1 = require("./entities/estadoCamion.entity");
const estadoAcoplado_entity_1 = require("./entities/estadoAcoplado.entity");
const estadoSemirremolque_entity_1 = require("./entities/estadoSemirremolque.entity");
const estadoTransportista_entity_1 = require("./entities/estadoTransportista.entity");
let UnidadService = class UnidadService {
    constructor(httpService, semirremolqueRepository, acopladoRepository, tipoRepository, tipoCamionRepository, CamionRepository, UnidadRepository, estadoCamionRepository, EstadoSemirremolqueRepository, EstadoAcopladoRepository, estadoTransportistaRepository, transportistaRepository) {
        this.httpService = httpService;
        this.semirremolqueRepository = semirremolqueRepository;
        this.acopladoRepository = acopladoRepository;
        this.tipoRepository = tipoRepository;
        this.tipoCamionRepository = tipoCamionRepository;
        this.CamionRepository = CamionRepository;
        this.UnidadRepository = UnidadRepository;
        this.estadoCamionRepository = estadoCamionRepository;
        this.EstadoSemirremolqueRepository = EstadoSemirremolqueRepository;
        this.EstadoAcopladoRepository = EstadoAcopladoRepository;
        this.estadoTransportistaRepository = estadoTransportistaRepository;
        this.transportistaRepository = transportistaRepository;
    }
    async testConnection() {
        try {
            const count = await this.UnidadRepository.count();
            console.log('DB connection works, Unidad count:', count);
        }
        catch (error) {
            console.error('DB connection failed:', error);
        }
    }
    getRandomItem(items) {
        if (!items || items.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    }
    async createUnidad(dto) {
        console.log("el dto de unidad es:", dto);
        const camion = await this.CamionRepository.findOneBy({ id: dto.tractoCamionId });
        if (!camion) {
            throw new common_1.NotFoundException(`Camión con id ${dto.tractoCamionId} no encontrado`);
        }
        let semirremolque = null;
        if (dto.tieneSemirremolque && dto.semiremolqueId) {
            semirremolque = await this.semirremolqueRepository.findOneBy({ id: dto.semiremolqueId });
            if (!semirremolque) {
                throw new common_1.NotFoundException(`Semirremolque con id ${dto.semiremolqueId} no encontrado`);
            }
        }
        let acoplado = null;
        if (dto.tieneAcoplado && dto.acopladoId) {
            acoplado = await this.acopladoRepository.findOneBy({ id: dto.acopladoId });
            if (!acoplado) {
                throw new common_1.NotFoundException(`Acoplado con id ${dto.acopladoId} no encontrado`);
            }
        }
        const subtotal = (semirremolque?.precio ?? 0) + (camion?.precio ?? 0) + (acoplado?.precio ?? 0);
        const unidad = this.UnidadRepository.create({
            idViaje: dto.viajeId,
            camion: camion,
            semiremolque: semirremolque || null,
            acoplado: acoplado || null,
            subtotal: subtotal
        });
        return this.UnidadRepository.save(unidad);
    }
    consultarTiposAcoplados() {
        return this.tipoRepository.find();
    }
    consultarTiposCamiones() {
        console.log("el error salta despues");
        return this.tipoCamionRepository.find();
    }
    async findDisponibles(unidadesOcupadas) {
        const unidades = await this.UnidadRepository.find({
            where: { UnidadId: (0, typeorm_3.In)(unidadesOcupadas) },
            relations: ['camion', 'acoplado', 'semiremolque'],
        });
        const camionesOcupados = unidades.map(u => u.camion?.id).filter(Boolean);
        const acopladosOcupados = unidades.map(u => u.acoplado?.id).filter(Boolean);
        const semirremolquesOcupados = unidades.map(u => u.semiremolque?.id).filter(Boolean);
        const camionesDisponibles = (await this.CamionRepository.find({
            where: { id: (0, typeorm_3.Not)((0, typeorm_3.In)(camionesOcupados)) },
        })).map(c => ({ ...c, tipo: c.tipoCamion.nombre }));
        ;
        const acopladosDisponibles = (await this.acopladoRepository.find({
            where: { id: (0, typeorm_3.Not)((0, typeorm_3.In)(acopladosOcupados)) },
        })).map(c => ({ ...c, tipo: c.tipo.nombre }));
        ;
        const semirremolquesDisponibles = (await this.semirremolqueRepository.find({
            where: { id: (0, typeorm_3.Not)((0, typeorm_3.In)(semirremolquesOcupados)) },
        })).map(c => ({ ...c, tipo: c.tipo.nombre }));
        ;
        return {
            camiones: camionesDisponibles,
            acoplados: acopladosDisponibles,
            semirremolques: semirremolquesDisponibles,
        };
    }
    findUnidadesDisponiblesByTipoRandom(camionesPedidos, unidadesDisponibles) {
        console.log('Camiones pedidos:', camionesPedidos);
        const { camiones, acoplados, semirremolques } = unidadesDisponibles;
        const unidadesFormadas = [];
        const errores = [];
        const usadosCamiones = new Set();
        const usadosSemirremolques = new Set();
        const usadosAcoplados = new Set();
        console.log('Los tipos de los camiones disponibles son:', camiones.map(c => c.tipo));
        const elegirRandom = (array) => {
            if (!array || array.length === 0)
                return undefined;
            const index = Math.floor(Math.random() * array.length);
            return array[index];
        };
        if (!camionesPedidos || !Array.isArray(camionesPedidos)) {
            console.error('camionesPedidos no está definido o no es un array:', camionesPedidos);
            return { unidadesFormadas: [], errores: ['camionesPedidos no está definido o no es un array'] };
        }
        for (const [index, pedido] of camionesPedidos.entries()) {
            const { tipo, semirremolque, acoplado } = pedido;
            console.log('El tipo del camion pedido es', tipo);
            const camionesDisponibles = camiones.filter(c => c.tipoCamion.nombre === tipo && !usadosCamiones.has(c.id));
            const camion = elegirRandom(camionesDisponibles) || undefined;
            console.log('el camion es:', camion);
            if (!camion) {
                errores.push(`No se encontró camión disponible del tipo "${tipo}" (pedido ${index + 1}).`);
                continue;
            }
            usadosCamiones.add(camion.id);
            let semi = null;
            console.log(semirremolque.trim().toLowerCase());
            if (semirremolque && semirremolque.trim().toLowerCase() !== 'sin semirremolque' && camion.tipoCamion.nombre.toLowerCase() === 'tractocamion') {
                if (tipo === 'tractoCamion' || semirremolque) {
                    const semisDisponibles = semirremolques.filter(s => s.tipo.toLowerCase() === semirremolque.toLowerCase() && !usadosSemirremolques.has(s.id));
                    semi = elegirRandom(semisDisponibles);
                    if (!semi) {
                        errores.push(`No se encontró semirremolque del tipo "${semirremolque}" (pedido ${index + 1}).`);
                        usadosSemirremolques.delete(camion.id);
                        continue;
                    }
                    usadosSemirremolques.add(semi.id);
                }
            }
            let acopladoEncontrado = null;
            if (acoplado && acoplado.trim().toLowerCase() !== 'sin acoplado' && camion.tipoCamion.nombre.toLowerCase() === 'tractocamion') {
                const tipoAcoplado = String(acoplado).trim().toLowerCase();
                const acopladosDisponibles = acoplados.filter(a => a.tipo.trim().toLowerCase() === tipoAcoplado && !usadosAcoplados.has(a.id));
                console.log('los usados son: ', usadosAcoplados);
                console.log('los acoplados disponibles son:', acopladosDisponibles);
                console.log('🔎 Buscando tipo:', tipoAcoplado);
                console.log('📦 Disponibles:', acopladosDisponibles.map(a => a.id));
                acopladoEncontrado = elegirRandom(acopladosDisponibles);
                console.log('Encontrado acoplado:', acopladoEncontrado);
                if (!acopladoEncontrado) {
                    errores.push(`No se encontró acoplado del tipo "${acoplado}" (pedido ${index + 1}).`);
                    usadosAcoplados.delete(camion.id);
                    if (semi)
                        usadosAcoplados.delete(semi.id);
                    continue;
                }
                usadosAcoplados.add(acopladoEncontrado.id);
            }
            const cargaTotal = camion.peso + (semi ? semi.capacidad : 0) + (acopladoEncontrado ? acopladoEncontrado.capacidad : 0);
            const subtotal = camion.precio + (semi ? semi.precio : 0) + (acopladoEncontrado ? acopladoEncontrado.precio : 0);
            console.log("llego hasta aca");
            unidadesFormadas.push({
                camion: camion,
                semirremolque: semi,
                acoplado: acopladoEncontrado,
                cargaTotal: cargaTotal,
                subtotal: subtotal
            });
        }
        console.log('Unidades formadas:', unidadesFormadas);
        return { unidadesFormadas, errores };
    }
    async getChoferesDisponibles(idViajesEnRango) {
        if (!idViajesEnRango) {
            console.log('No hay viajes en el rango proporcionado.');
            const allChoferes = await this.transportistaRepository.find();
            const idsParaSolicitar = allChoferes.map(c => c.idUsuario);
            const { data } = await (0, rxjs_1.lastValueFrom)(this.httpService.get('http://users-service:3003/users/by-ids', {
                params: {
                    ids: idsParaSolicitar.join(',')
                }
            }));
            return data;
        }
        const unidadesEnRango = await this.UnidadRepository.find({
            where: { idViaje: (0, typeorm_3.In)(idViajesEnRango) },
            relations: ['transportista']
        });
        const idsOcupados = [...new Set(unidadesEnRango.map(u => u.transportista.idUsuario))];
        let opcionesBusqueda = {};
        if (idsOcupados.length > 0) {
            opcionesBusqueda = {
                where: { idUsuario: (0, typeorm_3.Not)((0, typeorm_3.In)(idsOcupados)) },
            };
        }
        const choferesDisponibles = await this.transportistaRepository.find(opcionesBusqueda);
        console.log('IDs de choferes disponibles:', choferesDisponibles.map(c => c.idUsuario));
        if (choferesDisponibles.length === 0)
            return [];
        const idsParaSolicitar = choferesDisponibles.map(c => c.idUsuario);
        const { data } = await (0, rxjs_1.lastValueFrom)(this.httpService.get('http://users-service:3003/users/by-ids', {
            params: {
                ids: idsParaSolicitar.join(',')
            }
        }));
        return data;
    }
    asignarChoferes(asignaciones) {
        for (const asignacion of asignaciones)
            this.UnidadRepository.update(asignacion.unidadId, { transportista: { idUsuario: asignacion.choferId } });
    }
    findOne(id) {
        const unidad = this.UnidadRepository.find({ where: { idViaje: id }, relations: ['camion', 'semiremolque', 'acoplado'] });
        return unidad;
    }
    async createVehicle(createUnidadDto) {
        if (createUnidadDto.unidadTipo.toLowerCase() === 'camion') {
            const nuevoCamion = this.CamionRepository.create({
                tipoCamion: await this.tipoCamionRepository.findOneBy({ nombre: createUnidadDto.unidadSubtipo }),
                patente: createUnidadDto.patente,
                peso: createUnidadDto.capacidad,
                precio: createUnidadDto.precioKm,
                estadoCamion: await this.estadoCamionRepository.findOneBy({ nombre: 'disponible' }),
                cantidadEjes: createUnidadDto.cantidadEjes
            });
            return this.CamionRepository.save(nuevoCamion);
        }
        else if (createUnidadDto.unidadTipo.toLowerCase() === 'acoplado') {
            const nuevoAcoplado = this.acopladoRepository.create({
                tipo: await this.tipoRepository.findOneBy({ nombre: createUnidadDto.unidadSubtipo }),
                patente: createUnidadDto.patente,
                capacidad: createUnidadDto.capacidad,
                precio: createUnidadDto.precioKm,
                estado: await this.EstadoAcopladoRepository.findOneBy({ nombre: 'disponible' }),
                cantidadDeEjes: createUnidadDto.cantidadEjes
            });
            return this.acopladoRepository.save(nuevoAcoplado);
        }
        else if (createUnidadDto.unidadTipo.toLowerCase() === 'semirremolque') {
            const nuevoSemirremolque = this.semirremolqueRepository.create({
                tipo: await this.tipoRepository.findOneBy({ nombre: createUnidadDto.unidadSubtipo }),
                patente: createUnidadDto.patente,
                capacidad: createUnidadDto.capacidad,
                precio: createUnidadDto.precioKm,
                estado: await this.EstadoSemirremolqueRepository.findOneBy({ nombre: 'disponible' }),
                cantidadDeEjes: createUnidadDto.cantidadEjes
            });
            return this.semirremolqueRepository.save(nuevoSemirremolque);
        }
    }
    async findUnityByDriver(idusuario) {
        return this.UnidadRepository.find({
            where: { transportista: { idUsuario: idusuario } },
        });
    }
    async iniciarEstadoViaje(viajeId) {
        const unidades = await this.UnidadRepository.find({
            where: { idViaje: viajeId },
            relations: ['camion', 'semiremolque', 'acoplado'],
        });
        const estadoCamion = await this.estadoCamionRepository.findOne({ where: { nombre: 'enViaje' } });
        const estadoSemirremolque = await this.EstadoSemirremolqueRepository.findOne({ where: { nombre: 'enViaje' } });
        const estadoAcoplado = await this.EstadoAcopladoRepository.findOne({ where: { nombre: 'enViaje' } });
        const estadoTransportista = await this.estadoTransportistaRepository.findOne({ where: { nombre: 'enViaje' } });
        for (const unidad of unidades) {
            if (unidad.camion) {
                const camion = await this.CamionRepository.findOne({ where: { id: unidad.camion.id } });
                if (camion && estadoCamion) {
                    camion.estadoCamion = estadoCamion;
                    await this.CamionRepository.save(camion);
                }
            }
            if (unidad.semiremolque) {
                const semirremolque = await this.semirremolqueRepository.findOne({ where: { id: unidad.semiremolque.id } });
                if (semirremolque && estadoSemirremolque) {
                    semirremolque.estado = estadoSemirremolque;
                    await this.semirremolqueRepository.save(semirremolque);
                }
            }
            if (unidad.acoplado) {
                const acoplado = await this.acopladoRepository.findOne({ where: { id: unidad.acoplado.id } });
                if (acoplado && estadoAcoplado) {
                    acoplado.estado = estadoAcoplado;
                    await this.acopladoRepository.save(acoplado);
                }
            }
            const transportista = await this.transportistaRepository.findOne({ where: { idUsuario: unidad.transportista.idUsuario } });
            if (transportista && estadoTransportista) {
                transportista.estado = estadoTransportista;
                await this.transportistaRepository.save(transportista);
            }
        }
    }
    async finalizarEstadoViaje(viajeId) {
        const unidades = await this.UnidadRepository.find({
            where: { idViaje: viajeId },
            relations: ['camion', 'semiremolque', 'acoplado'],
        });
        const estadoCamion = await this.estadoCamionRepository.findOne({ where: { nombre: 'disponible' } });
        const estadoSemirremolque = await this.EstadoSemirremolqueRepository.findOne({ where: { nombre: 'disponible' } });
        const estadoAcoplado = await this.EstadoAcopladoRepository.findOne({ where: { nombre: 'disponible' } });
        const estadoTransportista = await this.estadoTransportistaRepository.findOne({ where: { nombre: 'disponible' } });
        for (const unidad of unidades) {
            if (unidad.camion) {
                const camion = await this.CamionRepository.findOne({ where: { id: unidad.camion.id } });
                if (camion && estadoCamion) {
                    camion.estadoCamion = estadoCamion;
                    await this.CamionRepository.save(camion);
                }
            }
            if (unidad.semiremolque) {
                const semirremolque = await this.semirremolqueRepository.findOne({ where: { id: unidad.semiremolque.id } });
                if (semirremolque && estadoSemirremolque) {
                    semirremolque.estado = estadoSemirremolque;
                    await this.semirremolqueRepository.save(semirremolque);
                }
            }
            if (unidad.acoplado) {
                const acoplado = await this.acopladoRepository.findOne({ where: { id: unidad.acoplado.id } });
                if (acoplado && estadoAcoplado) {
                    acoplado.estado = estadoAcoplado;
                    await this.acopladoRepository.save(acoplado);
                }
            }
            const transportista = await this.transportistaRepository.findOne({ where: { idUsuario: unidad.transportista.idUsuario } });
            if (transportista && estadoTransportista) {
                transportista.estado = estadoTransportista;
                await this.transportistaRepository.save(transportista);
            }
        }
    }
    async findAll() {
        return await this.UnidadRepository.find();
    }
};
exports.UnidadService = UnidadService;
exports.UnidadService = UnidadService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(semirremolque_entity_1.Semirremolque)),
    __param(2, (0, typeorm_1.InjectRepository)(acoplado_entity_1.Acoplado)),
    __param(3, (0, typeorm_1.InjectRepository)(tipo_entity_1.Tipo)),
    __param(4, (0, typeorm_1.InjectRepository)(tipoCamion_entity_1.TipoCamion)),
    __param(5, (0, typeorm_1.InjectRepository)(camion_entity_1.Camion)),
    __param(6, (0, typeorm_1.InjectRepository)(unidad_entity_1.Unidad)),
    __param(7, (0, typeorm_1.InjectRepository)(estadoCamion_entity_1.EstadoCamion)),
    __param(8, (0, typeorm_1.InjectRepository)(estadoSemirremolque_entity_1.EstadoSemirremolque)),
    __param(9, (0, typeorm_1.InjectRepository)(estadoAcoplado_entity_1.EstadoAcoplado)),
    __param(10, (0, typeorm_1.InjectRepository)(estadoTransportista_entity_1.estadoTransportista)),
    __param(11, (0, typeorm_1.InjectRepository)(transportista_entity_1.Transportista)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UnidadService);
//# sourceMappingURL=unidad.service.js.map