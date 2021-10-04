import { Route } from 'src/routes/routes.entity';
import { Station } from 'src/stations/stations.entity';
import { EntityRepository, Repository } from 'typeorm';
import { RouteDetail } from './routeDetails.entity';

@EntityRepository(RouteDetail)
export class RouteDetailsRepository extends Repository<RouteDetail> {
  findRouteByWayStation(stationTitle: string): Promise<Route[]> {
    return this.createQueryBuilder()
      .select('route_detail."routeId"', 'routeID')
      .distinct(true)
      .from(RouteDetail, 'route_detail')
      .innerJoin(
        'station',
        'station',
        'station.id = route_detail."wayStationId"',
      )
      .where('station.title = :stationTitle', { stationTitle })
      .execute();
  }

  async findWayStationsOnOneRoute(
    departure: Station,
    arrival: Station,
  ): Promise<
    { wayStationId: string; stationOrder: number; routeId: string }[]
  > {
    const { id: startId, title: startTitle } = departure;
    const { id: endId, title: endTitle } = arrival;
    const routeDetails = this.createQueryBuilder('route_detail')
      .select('route_detail."routeId"')
      .innerJoin(
        'station',
        'station',
        'route_detail."wayStationId" = station.id',
      )
      .where('station.id = :startId', { startId })
      .orWhere('station.id = :endId', { endId })
      .groupBy('route_detail."routeId"')
      .having('COUNT(*) > 1');

    const stations = this.createQueryBuilder()
      .select('station.id')
      .from(Station, 'station')
      .where('station.title = :startTitle', { startTitle })
      .orWhere('station.title = :endTitle', { endTitle });

    return this.createQueryBuilder('route_detail')
      .select('route_detail."wayStationId"')
      .addSelect('route_detail."stationOrder"')
      .addSelect('route_detail."routeId"')
      .where('route_detail."routeId" IN (' + routeDetails.getQuery() + ')')
      .setParameters(routeDetails.getParameters())
      .andWhere('route_detail."wayStationId" IN (' + stations.getQuery() + ')')
      .setParameters(stations.getParameters())
      .getRawMany();
  }
}
