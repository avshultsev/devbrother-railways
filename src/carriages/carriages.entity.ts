import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
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

  @Column()
  train: number;

  @Column()
  type: CarriageType;

  @OneToOne(() => User)
  @JoinColumn()
  conductor1: User;

  @OneToOne(() => User)
  @JoinColumn()
  conductor2: User;
}
