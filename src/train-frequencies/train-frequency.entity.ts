import { Frequency } from 'src/frequencies/frequency.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TrainFrequency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  train: number;

  @ManyToOne(() => Frequency, { eager: true })
  @JoinColumn()
  frequency: Frequency;
}
