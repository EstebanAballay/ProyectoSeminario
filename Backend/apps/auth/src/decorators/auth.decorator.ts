// Este archivo une varios decoradores para hacer nuestro sistema mas escalable
import { applyDecorators, UseGuards } from "@nestjs/common";
import { Role } from "../role.enum";
import { Roles } from "./roles.decorator";
import { AuthGuard } from "../guard/auth.guard";
import { RolesGuard } from "../guard/roles.guard";

// definimos un decorador personalizado @Auth que tiene varios decoradores dentro.
export function Auth(role: Role) {
  return applyDecorators(Roles(role), UseGuards(AuthGuard, RolesGuard));
}
// tenemos autenticacion y aitorizacion en una misma guarda