import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RouteDetailsService } from 'src/route-details/route-details.service';
import { StationsService } from 'src/stations/stations.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { Route } from './routes.entity';
import { RoutesRepository } from './routes.repository';

@Injectable()
export class RoutesService {
  constructor(
    private routesRepository: RoutesRepository,
    private stationService: StationsService,
    private routeDetailsService: RouteDetailsService,
  ) {}

  getRouteById(id: string): Promise<Route> {
    return this.routesRepository.findOne(id);
  }

  async getRoutesByStations(start: string, end: string): Promise<string[]> {
    const edge = this.findByEdgeStations(start, end);
    const mixed = this.findByMixedStations(start, end);
    const way = this.routeDetailsService.getRoutesByWayStations(start, end);
    const routes = [edge, mixed, way];
    const [byEdge, byMixed, byWay] = await Promise.all(routes);
    return [...byEdge, ...byMixed, ...byWay];
  }

  private async findByMixedStations(
    start: string,
    end: string,
  ): Promise<string[]> {
    const mixed = await this.routesRepository.findByMixedStations(start, end);
    return mixed.map((e) => e.route_id);
  }

  private async findByEdgeStations(start: string, end: string) {
    const edge = await this.routesRepository.findByEdgeStations(start, end);
    return edge.map((e) => e.id);
  }

  async createRoute(createRouteData: CreateRouteDto): Promise<Route> {
    const promises = Object.values(createRouteData).map(
      (stationTitle: string) =>
        this.stationService.getStationByName(stationTitle),
    );
    const [departurePoint, arrivalPoint] = await Promise.all(promises);
    if (!departurePoint || !arrivalPoint)
      throw new BadRequestException(
        'Such departure or arrival station does not exist!',
      );
    const newRoute = this.routesRepository.create({
      departurePoint,
      arrivalPoint,
    });
    await this.routesRepository.save(newRoute);
    return newRoute;
  }

  async deleteRoute(id: string): Promise<void> {
    const { affected } = await this.routesRepository.delete(id);
    if (!affected)
      throw new NotFoundException(`Route with "${id}" id not found!`);
  }
}
