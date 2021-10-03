import { Route } from 'src/routes/routes.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { TrainType } from './train-type.enum';

@Entity()
export class Train {
  @PrimaryColumn({ unique: true })
  number: number;

  @Column()
  type: TrainType;

  @ManyToOne(() => Route, { eager: true })
  @JoinColumn()
  route: Route;

  @Column({ type: 'time without time zone' })
  departureTime: Date;

  @OneToOne(() => User)
  @JoinColumn()
  lead: User;

  @OneToOne(() => User)
  @JoinColumn()
  machenist: User;

  @OneToOne(() => User)
  @JoinColumn()
  machenistAssistant: User;
}
