import { TrainFrequencyEnum } from 'src/train-frequencies/train-frequency.enum';
import { EntityRepository, Repository } from 'typeorm';
import { Train } from './trains.entity';

@EntityRepository(Train)
export class TrainRepository extends Repository<Train> {
  findTrainWithFrequencies(
    train: number,
  ): Promise<{ train: number; frequencyName: TrainFrequencyEnum }[]> {
    return this.createQueryBuilder('train')
      .select('train.number')
      .addSelect('train_frequency."frequencyName"')
      .innerJoin(
        'train_frequency',
        'train_frequency',
        'train.number = train_frequency.train',
      )
      .where('train_frequency.train = :train', { train })
      .getRawMany();
  }

  findTrainsByStations(departure, arrival) {
    return this.createQueryBuilder('train')
      .select('train.number')
      .addSelect('')
      .innerJoin('route', 'route.id = train."routeId"')
      .innerJoin('route_detail', '')
      .getMany();
  }
}
