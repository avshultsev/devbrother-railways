import { Frequency } from 'src/frequencies/frequency.entity';
import { Train } from 'src/trains/trains.entity';
import {
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TrainFrequency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Train)
  @JoinColumn()
  train: Train;

  @ManyToOne(() => Frequency, { eager: true })
  @JoinColumn()
  frequency: Frequency;
}
