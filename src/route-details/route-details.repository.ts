import { Route } from 'src/routes/routes.entity';
import { Station } from 'src/stations/stations.entity';
import { EntityRepository, Repository } from 'typeorm';
import { RouteDetail } from './routeDetails.entity';

@EntityRepository(RouteDetail)
export class RouteDetailsRepository extends Repository<RouteDetail> {
  findRouteByWayStation(stationTitle: string): Promise<Route[]> {
    return this.createQueryBuilder()
      .select('route_detail."routeId" AS id')
      .from(RouteDetail, 'route_detail')
      .innerJoin(
        'station',
        'station',
        'station.id = route_detail."wayStationId"',
      )
      .where('station.title = :stationTitle', { stationTitle })
      .groupBy('route_detail."routeId"')
      .getRawMany();
  }

  async findWayStationsOnOneRoute(
    departure: Station,
    arrival: Station,
  ): Promise<{ route: string; wayStation: string; stationOrder: number }[]> {
    const stationIDs = [departure.id, arrival.id]
      .map((id) => `'${id}'`)
      .join(', ');
    const routeDetails = this.createQueryBuilder('route_detail')
      .select('route_detail."routeId"')
      .innerJoin(
        'station',
        'station',
        'route_detail."wayStationId" = station.id',
      )
      .where('station.id IN (' + stationIDs + ')')
      .groupBy('route_detail."routeId"')
      .having('COUNT(*) > 1');

    return this.createQueryBuilder('route_detail')
      .select('route_detail."wayStationId" AS "wayStation"')
      .addSelect('route_detail."stationOrder" AS "stationOrder"')
      .addSelect('route_detail."routeId" AS route')
      .where('route_detail."routeId" IN (' + routeDetails.getQuery() + ')')
      .andWhere('route_detail."wayStationId" IN (' + stationIDs + ')')
      .getRawMany();
  }
}
