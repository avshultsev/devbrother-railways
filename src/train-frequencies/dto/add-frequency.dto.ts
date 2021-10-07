import { IsEnum } from 'class-validator';
import { TrainFrequencyEnum } from '../train-frequency.enum';

export class AddFrequencyDto {
  @IsEnum(TrainFrequencyEnum)
  frequencyName: TrainFrequencyEnum;
}
