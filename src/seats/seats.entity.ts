import { Carriage } from '../carriages/carriages.entity';
import { Ticket } from '../tickets/ticket.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Carriage, { eager: true })
  @JoinColumn()
  carriage: Carriage;

  @Column()
  number: number;

  @OneToOne(() => Ticket, (ticket) => ticket.seat, { nullable: true })
  @JoinColumn()
  ticket: Ticket;
}
