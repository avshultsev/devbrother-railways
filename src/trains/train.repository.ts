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

  findTrainsByRoutes(routes: string[]): Promise<Train[]> {
    return this.createQueryBuilder()
      .select('train.number')
      .addSelect('train.type')
      .addSelect('train.departureTime')
      .from(Train, 'train')
      .where(
        'train."routeId" IN (' + routes.map((e) => `'${e}'`).join(', ') + ')',
      )
      .getMany();
  }
}
