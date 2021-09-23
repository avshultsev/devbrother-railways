import { Column, Entity, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Carriage } from '../carriages/carriages.entity';
import { Ticket } from '../tickets/tickets.entity';
import { Train } from '../trains/trains.entity';

@Entity()
export class Seat {
  @PrimaryColumn()
  number: number;

  @PrimaryColumn()
  @ManyToOne(() => Carriage, (carriage) => carriage.number)
  carriage: number;

  @PrimaryColumn()
  @ManyToOne(() => Train, (train) => train.number)
  train: number;

  @Column()
  isBooked: boolean;

  @OneToOne(() => Ticket, (ticket) => ticket.seat)
  ticketID: Ticket;
}
