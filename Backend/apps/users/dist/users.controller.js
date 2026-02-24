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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const auth_guard_1 = require("./guard/auth.guard");
const update_perfil_dto_1 = require("./dto/update-perfil.dto");
const update_user_role_dto_1 = require("./dto/update-user-role.dto");
const role_enum_1 = require("./role.enum");
const update_user_status_dto_1 = require("./dto/update-user-status.dto");
const user_status_enum_1 = require("./user-status.enum");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    validarAdmin(req) {
        if (req?.user?.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Solo administradores pueden realizar esta acción');
        }
    }
    async register(createUserDto) {
        return this.usersService.crearUsuario(createUserDto);
    }
    async perfil(req) {
        console.log('perfil de controller de users back iniciado');
        const email = req.user.email;
        return this.usersService.perfil(email);
    }
    async actualizarPerfil(req, dto) {
        const email = req.user.email;
        return this.usersService.actualizarPerfil(email, dto);
    }
    async getUsersByIds(ids) {
        return this.usersService.findByIds(ids);
    }
    async listadoBasico(req) {
        this.validarAdmin(req);
        return this.usersService.listarUsuariosNombreDni();
    }
    async listadoGestionClientes(req) {
        this.validarAdmin(req);
        return this.usersService.listarUsuariosGestionClientes();
    }
    async actualizarRolUsuario(req, id, dto) {
        this.validarAdmin(req);
        return this.usersService.actualizarRolUsuario(id, dto.role);
    }
    async actualizarEstadoUsuario(req, id, dto) {
        this.validarAdmin(req);
        if (!Object.values(user_status_enum_1.UserStatus).includes(dto.estado)) {
            throw new common_1.ForbiddenException('Estado no permitido');
        }
        return this.usersService.actualizarEstadoUsuario(id, dto.estado);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('perfil'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "perfil", null);
__decorate([
    (0, common_1.Put)('perfil'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_perfil_dto_1.UpdatePerfilDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "actualizarPerfil", null);
__decorate([
    (0, common_1.Get)('by-ids'),
    __param(0, (0, common_1.Query)('ids', new common_1.ParseArrayPipe({ items: Number, separator: ',' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsersByIds", null);
__decorate([
    (0, common_1.Get)('listado-basico'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "listadoBasico", null);
__decorate([
    (0, common_1.Get)('gestion-clientes'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "listadoGestionClientes", null);
__decorate([
    (0, common_1.Patch)(':id/role'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_user_role_dto_1.UpdateUserRoleDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "actualizarRolUsuario", null);
__decorate([
    (0, common_1.Patch)(':id/estado'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_user_status_dto_1.UpdateUserStatusDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "actualizarEstadoUsuario", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map