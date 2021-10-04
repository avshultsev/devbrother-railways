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

  private getQb(title: string) {
    const prefix = Math.floor(Math.random() * 1000);
    return this.createQueryBuilder()
      .select('station.id')
      .from(Station, 'station')
      .where(`station.title = :title_${prefix}`, {
        [`title_${prefix}`]: title,
      });
  }

  findByMixedStations(
    start: string,
    end: string,
  ): Promise<{ route_id: string }[]> {
    const startQb = this.getQb(start);
    const endQb = this.getQb(end);

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

  async findByEdgeStations(
    start: string,
    end: string,
  ): Promise<{ id: string }[]> {
    const startQb = this.getQb(start);
    const endQb = this.getQb(end);
    return this.createQueryBuilder()
      .select('route.id')
      .from(Route, 'route')
      .where('route."departurePointId" IN (' + startQb.getQuery() + ')')
      .setParameters(startQb.getParameters())
      .andWhere('route."arrivalPointId" IN (' + endQb.getQuery() + ')')
      .setParameters(endQb.getParameters())
      .getMany();
  }
}
