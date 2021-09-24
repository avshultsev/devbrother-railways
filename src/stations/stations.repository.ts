import { EntityRepository, Repository } from 'typeorm';
import { Station } from './stations.entity';

@EntityRepository(Station)
export class StationsRepository extends Repository<Station> {
  findWithFilter(title: string): Promise<Station[]> {
    return this.createQueryBuilder('station')
      .where('LOWER(station.title) LIKE LOWER(:title)', {
        title: `%${title}%`,
      })
      .getMany();
  }
}
