import { TrainType } from '../train-type.enum';

export class AddTrainDto {
  number: number;
  type: TrainType;
  route: string;
  departureTime: Date;
  lead: string;
  machenist: string;
  machenistAssistant: string;
}
