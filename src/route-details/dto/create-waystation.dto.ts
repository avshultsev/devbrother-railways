import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWayStationDto {
  @IsNotEmpty()
  stationTitle: string;

  @IsNotEmpty()
  @IsNumber()
  stationOrder: number;

  @IsNotEmpty()
  @IsNumber()
  time: number;
}
