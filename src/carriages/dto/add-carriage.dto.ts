import { CarriageType } from '../carriage-type.enum';

export class AddCarriageDto {
  number: number;
  type: CarriageType;
  conductor1: string;
  conductor2: string;
}
