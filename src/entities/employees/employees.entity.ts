import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Ticket } from '../tickets/tickets.entity';

@Entity()
export class Employee {
  @PrimaryColumn()
  passportID: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  fathersName: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @OneToMany(() => Ticket, (ticket) => ticket.owner)
  tickets: Ticket[];
}
