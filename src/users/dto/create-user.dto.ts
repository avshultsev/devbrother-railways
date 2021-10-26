import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Roles } from '../roles.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(Roles)
  role: Roles;
}
