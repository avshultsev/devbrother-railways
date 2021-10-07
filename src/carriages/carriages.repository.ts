import { EntityRepository, Repository } from 'typeorm';
import { Carriage } from './carriages.entity';

@EntityRepository(Carriage)
export class CarriagesRepository extends Repository<Carriage> {
  findTrainsWithFreeSeats(trainNumbers: number[]) {
    return this.createQueryBuilder('carriage')
      .select('carriage.train')
      .innerJoin('seat', 'seat', 'carriage.id = seat."carriageId"')
      .where('seat.ticket IS NULL')
      .andWhere('carriage.train IN (' + trainNumbers.join(', ') + ')')
      .groupBy('carriage.train')
      .getRawMany();
  }
}
