import { IsNotEmpty } from 'class-validator';

export class CreateStationDto {
  @IsNotEmpty()
  title: string;
}
