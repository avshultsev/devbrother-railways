import { IsNotEmpty, Length } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Length(6)
  password: string;
}
