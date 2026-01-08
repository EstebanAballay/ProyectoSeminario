"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ROLES_KEY = "roles";
const Roles = (role) => (0, common_1.SetMetadata)(exports.ROLES_KEY, role); // leemos el metadato que se pasa aca en el guard
exports.Roles = Roles;
// define el decorador personalizado @Roles que asigna un rol a una ruta
