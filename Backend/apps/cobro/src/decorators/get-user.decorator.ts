//Esta funcion obtiene el usuario de la request que le llega del front
//sirve para poder registrar el usuario en una transaccion
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);