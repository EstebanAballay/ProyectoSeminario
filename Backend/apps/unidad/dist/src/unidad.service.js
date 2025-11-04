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
const unidad_entity_1 = require("./entities/unidad.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
let UnidadService = class UnidadService {
    constructor(unidadRepo) {
        this.unidadRepo = unidadRepo;
    }
    async testConnection() {
        try {
            const count = await this.unidadRepo.count();
            console.log('DB connection works, Unidad count:', count);
        }
        catch (error) {
            console.error('DB connection failed:', error);
        }
    }
    create(createUnidadDto) {
        return 'This action adds a new unidad';
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
    __param(0, (0, typeorm_2.InjectRepository)(unidad_entity_1.Unidad)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UnidadService);
//# sourceMappingURL=unidad.service.js.map