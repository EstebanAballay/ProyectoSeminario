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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const typeorm_1 = require("typeorm");
const role_enum_1 = require("./role.enum");
const typeorm_2 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let UsersService = class UsersService {
    constructor(userRepo, jwtService) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
    }
    async testConnection() {
        try {
            const count = await this.userRepo.count();
            console.log('DB connection works, User count:', count);
        }
        catch (error) {
            console.error('DB connection failed:', error);
        }
    }
    async crearUsuario(dto) {
        const existente = await this.userRepo.findOne({
            where: { email: dto.email },
        });
        if (existente) {
            throw new common_1.BadRequestException('El email ya está registrado');
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(dto.password, salt);
        const nuevoUsuario = this.userRepo.create({
            nombre: dto.nombre,
            apellido: dto.apellido,
            dni: dto.dni,
            email: dto.email,
            celular: dto.celular,
            CUIT: dto.CUIT,
            direccion: dto.direccion,
            password_hash: passwordHash,
            role: role_enum_1.Role.CLIENT,
        });
        const guardado = await this.userRepo.save(nuevoUsuario);
        delete guardado.password_hash;
        return guardado;
    }
    async login(dto) {
        const usuario = await this.userRepo.findOne({ where: { email: dto.email } });
        if (!usuario) {
            throw new common_1.UnauthorizedException('Email o contraseña incorrectos');
        }
        const isMatch = await bcrypt.compare(dto.password, usuario.password_hash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Email o contraseña incorrectos');
        }
        const token = this.jwtService.sign({ id: usuario.id, email: usuario.email, role: usuario.role });
        const { password_hash, ...rest } = usuario;
        return { ...rest, token };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        jwt_1.JwtService])
], UsersService);
//# sourceMappingURL=users.service.js.map