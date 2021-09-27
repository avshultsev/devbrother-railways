import { EntityRepository, Repository } from 'typeorm';
import { Route } from './routes.entity';

@EntityRepository(Route)
export class RoutesRepository extends Repository<Route> {
  findByStation(title: string): Promise<Route[]> {
    return this.createQueryBuilder('route')
      .where('LOWER(route.departurePoint) LIKE LOWER(:title)', {
        title: `%${title}%`,
      })
      .orWhere('LOWER(route.arrivalPoint) LIKE LOWER(:title)', {
        title: `%${title}%`,
      }) /*add .leftJoin(with routeDetails table)*/
      .getMany();
  }
}
