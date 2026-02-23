"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUser = void 0;
//Esta funcion obtiene el usuario de la request que le llega del front
//sirve para poder registrar el usuario en una transaccion
const common_1 = require("@nestjs/common");
exports.GetUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
