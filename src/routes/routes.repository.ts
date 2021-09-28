import { EntityRepository, Repository } from 'typeorm';
import { Route } from './routes.entity';

@EntityRepository(Route)
export class RoutesRepository extends Repository<Route> {
  async findByStation(title: string): Promise<Route[]> {
    return this.createQueryBuilder()
      .select('route.id')
      .from(Route, 'route')
      .innerJoin(
        'station',
        'station',
        'station.id = route."departurePointId" OR station.id = route."arrivalPointId"',
      )
      .where('station.title = :title', { title })
      .getMany();
  }
}
