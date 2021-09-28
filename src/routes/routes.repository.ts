import { EntityRepository, Repository } from 'typeorm';
import { Route } from './routes.entity';

@EntityRepository(Route)
export class RoutesRepository extends Repository<Route> {
  async findByStation(title: string): Promise<Route[]> {
    const ids = await this.createQueryBuilder('route')
      .leftJoinAndSelect(
        'station',
        'station',
        '(route.departurePoint = station.id) OR (route.arrivalPoint = station.id)',
      )
      .where('LOWER(station.title) LIKE LOWER(:title)', {
        title: `%${title}%`,
      })
      .getMany();

    return this.findByIds(ids, {
      relations: ['departurePoint', 'arrivalPoint'],
    });
  }
}
