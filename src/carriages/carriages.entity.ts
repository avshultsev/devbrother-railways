import { Train } from 'src/trains/trains.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

enum CarriageType {
  SV = 'SV',
  COMPARTMENT = 'COMPARTMENT',
  ECONOM = 'ECONOM',
  SITTING = 'SITTING',
}

@Entity()
export class Carriage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: number;

  @ManyToOne(() => Train, { eager: true })
  train: Train;

  @Column()
  type: CarriageType;

  @OneToOne(() => User)
  conductor1: User;

  @OneToOne(() => User)
  conductor2: User;
}
