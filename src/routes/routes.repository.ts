import { Station } from 'src/stations/stations.entity';
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

  findEdgeStationWithWayStation(start: string, end: string) {
    const getQb = (title: string) => {
      const prefix = Math.floor(Math.random() * 1000);
      return this.createQueryBuilder()
        .select('station.id')
        .from(Station, 'station')
        .where(`station.title = :title_${prefix}`, {
          [`title_${prefix}`]: title,
        });
    };

    const startQb = getQb(start);
    const endQb = getQb(end);

    return this.createQueryBuilder('route')
      .select('route.id')
      .innerJoin(
        'route_detail',
        'route_detail',
        'route.id = route_detail."routeId"',
      )
      .where(
        'route."departurePointId" IN (' +
          startQb.getQuery() +
          ') AND route_detail."wayStationId" IN (' +
          endQb.getQuery() +
          ')',
      )
      .setParameters(startQb.getParameters())
      .setParameters(endQb.getParameters())
      .orWhere(
        'route_detail."wayStationId" IN (' +
          startQb.getQuery() +
          ') AND route."arrivalPointId" IN (' +
          endQb.getQuery() +
          ')',
      )
      .setParameters(startQb.getParameters())
      .setParameters(endQb.getParameters())
      .getRawMany();
  }
}
