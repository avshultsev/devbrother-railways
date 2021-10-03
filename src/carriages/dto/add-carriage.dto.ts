import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { CarriageType } from '../carriage-type.enum';

export class AddCarriageDto {
  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsNotEmpty()
  @IsEnum(CarriageType)
  type: CarriageType;

  @IsNotEmpty()
  conductor1: string;

  @IsNotEmpty()
  conductor2: string;
}
