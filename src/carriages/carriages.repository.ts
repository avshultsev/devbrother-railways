import { EntityRepository, Repository } from 'typeorm';
import { Carriage } from './carriages.entity';

@EntityRepository(Carriage)
export class CarriagesRepository extends Repository<Carriage> {
  findTrainsWithFreeSeats(
    trainNumbers: number[],
  ): Promise<{ train: number }[]> {
    return this.createQueryBuilder('carriage')
      .select('carriage.train AS "train"')
      .innerJoin('seat', 'seat', 'carriage.id = seat."carriageId"')
      .where('seat.ticket IS NULL')
      .andWhere('carriage.train IN (' + trainNumbers.join(', ') + ')')
      .groupBy('carriage.train')
      .getRawMany();
  }

  findTrainFreeSeats(
    trainNumber: number,
  ): Promise<{ carriage: number; seat: number }[]> {
    return this.createQueryBuilder('carriage')
      .select('carriage.number AS "carriage"')
      .addSelect('seat.number AS "seat"')
      .innerJoin('seat', 'seat', 'carriage.id = seat."carriageId"')
      .where('carriage.train IN (:trainNumber)', { trainNumber })
      .andWhere('seat.ticket IS NULL')
      .orderBy('carriage.number', 'ASC')
      .addOrderBy('seat.number', 'ASC')
      .getRawMany();
  }
}
