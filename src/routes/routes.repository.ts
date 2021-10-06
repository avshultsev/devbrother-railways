import { EntityRepository, Repository } from 'typeorm';
import { Route } from './routes.entity';

@EntityRepository(Route)
export class RoutesRepository extends Repository<Route> {
  findByStation(title: string): Promise<Route[]> {
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

  findByMixedStations(
    startID: string,
    endID: string,
  ): Promise<{ id: string }[]> {
    return this.createQueryBuilder()
      .select('route.id AS "id"')
      .from(Route, 'route')
      .innerJoin(
        'route_detail',
        'route_detail',
        'route.id = route_detail."routeId"',
      )
      .where(
        'route."departurePointId" IN (' +
          `'${startID}'` +
          ') AND route_detail."wayStationId" IN (' +
          `'${endID}'` +
          ')',
      )
      .orWhere(
        'route_detail."wayStationId" IN (' +
          `'${startID}'` +
          ') AND route."arrivalPointId" IN (' +
          `'${endID}'` +
          ')',
      )
      .groupBy('route.id')
      .getRawMany();
  }
}
