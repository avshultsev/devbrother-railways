import { Repository } from 'typeorm';
import { Seat } from './seats.entity';

export class SeatsRepository extends Repository<Seat> {}
