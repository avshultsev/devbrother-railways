import { Repository } from 'typeorm';
import { Ticket } from './tickets.entity';

export class TicketsRepository extends Repository<Ticket> {}
