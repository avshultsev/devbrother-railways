import { Repository } from 'typeorm';
import { Train } from './trains.entity';

export class TrainsRepository extends Repository<Train> {}
