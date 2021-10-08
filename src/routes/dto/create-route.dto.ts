import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRouteDto {
  @IsNotEmpty()
  departurePoint: string;

  @IsNotEmpty()
  arrivalPoint: string;

  @IsNotEmpty()
  @IsNumber()
  travelTime: number;
}
