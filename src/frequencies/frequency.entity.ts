import { TrainFrequencyEnum } from '../train-frequencies/train-frequency.enum';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Frequency {
  @PrimaryColumn({ unique: true })
  name: TrainFrequencyEnum;
}
