import { IsNotEmpty } from 'class-validator';

export class CreateRouteDto {
  @IsNotEmpty()
  departurePoint: string;

  @IsNotEmpty()
  arrivalPoint: string;
}
