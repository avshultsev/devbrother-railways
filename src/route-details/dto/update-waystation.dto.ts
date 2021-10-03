import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateWayStationDto {
  @IsOptional()
  @IsNotEmpty()
  stationOrder?: number;

  @IsOptional()
  @IsNotEmpty()
  wayStation?: string;

  @IsOptional()
  @IsNotEmpty()
  time?: number;
}
