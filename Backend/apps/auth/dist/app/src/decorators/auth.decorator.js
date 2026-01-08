"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = Auth;
// Este archivo une varios decoradores para hacer nuestro sistema mas escalable
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("./roles.decorator");
const auth_guard_1 = require("../guard/auth.guard");
const roles_guard_1 = require("../guard/roles.guard");
// definimos un decorador personalizado @Auth que tiene varios decoradores dentro.
function Auth(role) {
    return (0, common_1.applyDecorators)((0, roles_decorator_1.Roles)(role), (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard));
}
// tenemos autenticacion y aitorizacion en una misma guarda
