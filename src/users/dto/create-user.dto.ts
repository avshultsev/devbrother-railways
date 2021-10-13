import { IsEnum, IsNotEmpty, Length } from 'class-validator';
import { Roles } from '../roles.enum';

export class CreateUserDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Length(6)
  password: string;

  @IsEnum(Roles)
  role: Roles;
}
