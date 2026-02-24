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
const user_status_enum_1 = require("./user-status.enum");
const typeorm_2 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(userRepo) {
        this.userRepo = userRepo;
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
            estado: user_status_enum_1.UserStatus.ACTIVO,
        });
        const guardado = await this.userRepo.save(nuevoUsuario);
        delete guardado.password_hash;
        return guardado;
    }
    async findOneByEmail(email) {
        return await this.userRepo.findOneBy({ email });
    }
    async findOneByEmailWithPassword(email) {
        return await this.userRepo.findOne({
            where: { email },
            select: ['id', 'nombre', 'email', 'password_hash', 'role'],
        });
    }
    async perfil(email) {
        console.log('perfil de service de users back iniciado');
        return this.userRepo.findOne({
            where: { email },
            select: [
                'id',
                'nombre',
                'apellido',
                'dni',
                'email',
                'celular',
                'CUIT',
                'direccion',
                'role',
            ],
        });
    }
    async actualizarPerfil(emailActual, dto) {
        const usuario = await this.userRepo.findOne({ where: { email: emailActual } });
        if (!usuario) {
            throw new common_1.BadRequestException('Usuario no encontrado');
        }
        if (dto.email && dto.email !== emailActual) {
            const existeEmail = await this.userRepo.findOne({ where: { email: dto.email } });
            if (existeEmail) {
                throw new common_1.BadRequestException('El email ya está registrado');
            }
        }
        usuario.nombre = dto.nombre ?? usuario.nombre;
        usuario.apellido = dto.apellido ?? usuario.apellido;
        usuario.email = dto.email ?? usuario.email;
        usuario.celular = dto.celular ?? usuario.celular;
        usuario.CUIT = dto.CUIT ?? usuario.CUIT;
        usuario.direccion = dto.direccion ?? usuario.direccion;
        await this.userRepo.save(usuario);
        return this.perfil(usuario.email);
    }
    async findByIds(ids) {
        return this.userRepo.findBy({ id: (0, typeorm_1.In)(ids) });
    }
    async listarUsuariosNombreDni() {
        return this.userRepo.find({
            select: ['id', 'nombre', 'apellido', 'dni', 'role'],
            order: { nombre: 'ASC' },
        });
    }
    async asegurarEstadoActivoUsuariosExistentes() {
        await this.userRepo
            .createQueryBuilder()
            .update(user_entity_1.User)
            .set({ estado: user_status_enum_1.UserStatus.ACTIVO })
            .where('estado IS NULL')
            .execute();
    }
    async listarUsuariosGestionClientes() {
        await this.asegurarEstadoActivoUsuariosExistentes();
        return this.userRepo.find({
            select: ['id', 'nombre', 'apellido', 'dni', 'role', 'estado'],
            order: { nombre: 'ASC' },
        });
    }
    async actualizarRolUsuario(id, role) {
        if (!Object.values(role_enum_1.Role).includes(role)) {
            throw new common_1.BadRequestException('Rol inválido');
        }
        const usuario = await this.userRepo.findOne({ where: { id } });
        if (!usuario) {
            throw new common_1.BadRequestException('Usuario no encontrado');
        }
        usuario.role = role;
        await this.userRepo.save(usuario);
        return {
            id: usuario.id,
            nombre: usuario.nombre,
            dni: usuario.dni,
            role: usuario.role,
            estado: usuario.estado,
        };
    }
    async actualizarEstadoUsuario(id, estado) {
        if (!Object.values(user_status_enum_1.UserStatus).includes(estado)) {
            throw new common_1.BadRequestException('Estado inválido');
        }
        const usuario = await this.userRepo.findOne({ where: { id } });
        if (!usuario) {
            throw new common_1.BadRequestException('Usuario no encontrado');
        }
        usuario.estado = estado;
        await this.userRepo.save(usuario);
        return {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            dni: usuario.dni,
            role: usuario.role,
            estado: usuario.estado,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map