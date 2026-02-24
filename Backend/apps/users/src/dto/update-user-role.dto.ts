import { IsEnum } from 'class-validator';
import { Role } from '../role.enum';

export class UpdateUserRoleDto {
  @IsEnum(Role)
  role: Role;
}
