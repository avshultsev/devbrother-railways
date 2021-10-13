import { IsEnum } from 'class-validator';
import { Roles } from '../roles.enum';

export class ChangeRoleDto {
  @IsEnum(Roles)
  role: Roles;
}
