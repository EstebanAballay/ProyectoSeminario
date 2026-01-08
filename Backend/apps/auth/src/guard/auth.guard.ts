// La función de este archivo es interceptar cada solicitud HTTP antes de que llegue al controlador y verificar si:
// el cliente envió un token JWT válido en la cabecera de autorización (1)
// dicho token es autenticado correctamente (es decir, no está vencido ni modificado) (2)
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { jwtConstants } from "../constants/jwt.constant";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> { // se extrae el token del encabezado Authorization usando un método auxiliar
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request); // metodo auxiliar

    if (!token) {
      throw new UnauthorizedException(); // excepcion si no hay token
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, { // valida la firma y decodifica el token
        secret: jwtConstants.secret, // usa la clave secreta definida en jwtConstants.secret
      });
      request.user = payload; // si es válido, guarda el payload decodificado aca
    } catch (error) {
      throw new UnauthorizedException(); // sino lanza excepcion
    }

    return true;
  }

  private extractTokenFromHeader(request: Request) { // metodo auxiliar 
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}