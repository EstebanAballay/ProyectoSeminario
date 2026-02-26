import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    // Leemos el header que inyectó el API Gateway
    const userDataHeader = request.headers['x-user-data'];

    if (!userDataHeader) {
      // Si no llega el header, significa que la petición no pasó por el Gateway o falló la autenticación
      throw new UnauthorizedException('Acceso denegado: No se recibió el contexto del usuario');
    }

    // Parseamos el string JSON de vuelta a un objeto JavaScript
    const user = JSON.parse(userDataHeader);

    // Si usas @GetUser('id'), devuelve solo el ID. Si usas @GetUser(), devuelve todo el objeto.
    return data ? user[data] : user; 
  },
);