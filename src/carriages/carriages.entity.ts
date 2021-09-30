import { Train } from 'src/trains/trains.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CarriageType } from './carriage-type.enum';

@Entity()
export class Carriage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: number;

  @ManyToOne(() => Train, { eager: true })
  @JoinColumn()
  train: Train;

  @Column()
  type: CarriageType;

  @OneToOne(() => User)
  @JoinColumn()
  conductor1: User;

  @OneToOne(() => User)
  @JoinColumn()
  conductor2: User;
}
