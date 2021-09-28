import { Route } from 'src/routes/routes.entity';
import { EntityRepository, Repository } from 'typeorm';
import { RouteDetail } from './routeDetails.entity';

@EntityRepository(RouteDetail)
export class RouteDetailsRepository extends Repository<RouteDetail> {
  async findRouteByWayStation(stationTitle: string): Promise<Route[]> {
    const result = await this.createQueryBuilder()
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
    return result;
  }
}
