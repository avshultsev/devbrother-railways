import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Seat } from '../seats/seats.entity';
import { Station } from '../stations/stations.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  ticketID: string;

  @OneToOne(() => Seat, (seat) => seat.ticketID)
  seat: number;

  @Column()
  carriage: number;

  @Column()
  train: number;

  @Column()
  departureTime: Date;

  @Column()
  dateOfBuying: Date;

  @Column()
  departurePoint: Station;

  @Column()
  arrivalPoint: Station;
}
