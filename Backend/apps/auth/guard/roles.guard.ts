<<<<<<< HEAD
// Este role guard protege los endpoint en base al rol que tiene el usuario. 
=======
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { Role } from "../../users/src/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [ // a traves de reflector lee los metadatos
      context.getHandler(),
      context.getClass(),
    ]);

    if (!role) { // Si no requiere el rol
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (user.role === Role.ADMIN) {
      return true
    }
    
    return user.role === role;
  }
}