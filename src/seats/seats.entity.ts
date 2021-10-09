import { Carriage } from 'src/carriages/carriages.entity';
import { Ticket } from 'src/tickets/ticket.entity';
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
