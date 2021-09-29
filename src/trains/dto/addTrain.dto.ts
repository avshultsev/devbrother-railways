export enum TrainType {
  BRAND = 'BRAND',
  EXPRESS = 'EXPRESS',
  PASSENGER = 'PASSENGER',
}

export enum TrainFrequency {
  ODD = 'ODD',
  EVEN = 'EVEN',
  DAILY = 'DAILY',
  MON = 'MON',
  TUE = 'TUE',
  WED = 'WED',
  THU = 'THU',
  FRI = 'FRI',
  SAT = 'SAT',
  SUN = 'SUN',
}

export class AddTrainDto {
  number: number;
  type: TrainType;
  route: string;
  departureTime: Date;
  lead: string;
  machenist: string;
  machenistAssistant: string;
}
