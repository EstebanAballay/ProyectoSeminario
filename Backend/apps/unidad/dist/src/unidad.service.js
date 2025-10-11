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
let UnidadService = class UnidadService {
    constructor(httpService, semirremolqueRepository, acopladoRepository, tipoRepository, tipoCamionRepository, CamionRepository, UnidadRepository) {
        this.httpService = httpService;
        this.semirremolqueRepository = semirremolqueRepository;
        this.acopladoRepository = acopladoRepository;
        this.tipoRepository = tipoRepository;
        this.tipoCamionRepository = tipoCamionRepository;
        this.CamionRepository = CamionRepository;
        this.UnidadRepository = UnidadRepository;
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
    async createUnidad(createUnidadDto) {
        let Semirremolque = null;
        let Camion = null;
        let Acoplado = null;
        console.log("llegue afuera del if");
        if (createUnidadDto.tipoCamion == 'tractoCamion') {
            console.log("llegue adentro del if");
            const tipoSemi = await this.tipoRepository.findOne({ where: { nombre: createUnidadDto.tipoSemirremolque } });
            if (!tipoSemi) {
                throw new common_1.NotFoundException('No se encontro el tipo de semiremolque');
            }
            if (createUnidadDto.semiremolque == true) {
                const semirremolques = await this.semirremolqueRepository.find({ where: { tipo: tipoSemi } });
                if (!semirremolques) {
                    throw new common_1.NotFoundException('No se encontro ninguna unidad de este tipo');
                }
                Semirremolque = this.getRandomItem(semirremolques);
            }
            else {
                throw new common_1.NotFoundException('Debe seleccionar un semirremolque si selecciona un tractocamion');
            }
        }
        else {
            const tipoCamion = await this.tipoCamionRepository.findOne({ where: { nombre: createUnidadDto.tipoCamion } });
            if (!tipoCamion) {
                throw new common_1.NotFoundException('No se encontro un tipo de camion entero con ese nombre');
            }
            const camionesEnteros = await this.CamionRepository.find({ where: { tipoCamion: tipoCamion } });
            if (!camionesEnteros) {
                throw new common_1.NotFoundException('No se encontro ningun camion entero de este tipo');
            }
            Camion = this.getRandomItem(camionesEnteros);
        }
        if (createUnidadDto.acoplado == true) {
            const acoplados = await this.acopladoRepository.find();
            if (!acoplados) {
                throw new common_1.NotFoundException('No se encontro ningun acoplado de este tipo');
            }
            Acoplado = this.getRandomItem(acoplados);
        }
        const subtotal = Semirremolque?.precio + Camion?.precio + Acoplado?.precio;
        const cargaTotal = Semirremolque.capacidad + Acoplado.capacidad;
        const unidadNueva = this.UnidadRepository.create({
            idViaje: createUnidadDto.viajeId,
            Camion: Camion,
            semiremolque: Semirremolque,
            acoplado: Acoplado,
            subtotal: subtotal
        });
        return this.UnidadRepository.save(unidadNueva);
    }
    findAll() {
        return `This action returns all unidad`;
    }
    findOne(id) {
        return `This action returns a #${id} unidad`;
    }
    update(id, updateUnidadDto) {
        return `This action updates a #${id} unidad`;
    }
    remove(id) {
        return `This action removes a #${id} unidad`;
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
    __metadata("design:paramtypes", [axios_1.HttpService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UnidadService);
//# sourceMappingURL=unidad.service.js.map