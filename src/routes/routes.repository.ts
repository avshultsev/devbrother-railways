import { EntityRepository, Repository } from 'typeorm';
import { Route } from './routes.entity';

@EntityRepository(Route)
export class RoutesRepository extends Repository<Route> {
  findByStation(title: string): Promise<Route[]> {
    return this.createQueryBuilder('route')
      .leftJoinAndSelect(
        'station',
        'station',
        '(route.departurePoint = station.id) OR (route.arrivalPoint = station.id)',
      )
      .where('LOWER(station.title) LIKE LOWER(:title)', {
        title: `%${title}%`,
      })
      .getMany();
  }
}
