import { IsDate, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { TrainType } from '../train-type.enum';

export class AddTrainDto {
  @IsNotEmpty()
  number: number;

  @IsEnum(TrainType)
  type: TrainType;

  @IsNotEmpty()
  route: string;

  @IsDate()
  departureTime: Date;

  @IsEmail()
  @IsNotEmpty()
  lead: string;

  @IsEmail()
  @IsNotEmpty()
  machenist: string;

  @IsEmail()
  @IsNotEmpty()
  machenistAssistant: string;
}
