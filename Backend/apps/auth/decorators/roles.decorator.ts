import { SetMetadata } from "@nestjs/common";
import { Role } from "../../users/src/role.enum";

export const ROLES_KEY = "roles";
export const Roles = (role: Role) => SetMetadata(ROLES_KEY, role); // leemos el metadato que se pasa aca en el guard