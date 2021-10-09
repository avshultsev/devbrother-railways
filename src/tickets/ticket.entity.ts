import { Seat } from 'src/seats/seats.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TicketState } from './ticket-state.enum';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Seat, (seat) => seat.ticket)
  @JoinColumn()
  seat: Seat;

  @ManyToOne(() => User)
  @JoinColumn()
  passenger: User;

  @Column({ type: 'date' })
  departureDate: Date;

  @Column()
  departurePoint: string;

  @Column()
  arrivalPoint: string;

  @Column()
  state: TicketState;

  @Column({ type: 'date' })
  timestamp: Date;

  @Column()
  name: string;

  @Column()
  surname: string;
}
