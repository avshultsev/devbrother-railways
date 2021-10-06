import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RouteDetailsService } from 'src/route-details/route-details.service';
import { Station } from 'src/stations/stations.entity';
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
    const stations = [start, end].map((title) =>
      this.stationService.getStationByName(title),
    );
    try {
      const [departure, arrival] = await Promise.all(stations);
      const edge = this.findByEdgeStations(departure, arrival);
      const mixed = this.findByMixedStations(departure, arrival);
      const way = this.routeDetailsService.getRoutesByTwoWayStations(
        departure,
        arrival,
      );
      const promises = [edge, mixed, way];
      const [byEdge, byMixed, byWay] = await Promise.all(promises);
      const routes = [...byEdge, ...byMixed, ...byWay];
      if (!routes.length)
        throw new NotFoundException(
          `Routes between ${start} and ${end} not found!`,
        );
      return routes;
    } catch (err) {
      throw err;
    }
  }

  private async findByMixedStations(departure: Station, arrival: Station) {
    const mixed = await this.routesRepository.findByMixedStations(
      departure.id,
      arrival.id,
    );
    return mixed.map((route) => route.id);
  }

  private async findByEdgeStations(departure: Station, arrival: Station) {
    const routes = await this.routesRepository.find({
      where: { departurePoint: departure, arrivalPoint: arrival },
    });
    return routes.map((route) => route.id);
  }

  async getRoutesPassingThroughStation(
    stationTitle: string,
  ): Promise<string[]> {
    const [wayStationRoutes, edgeStationRoutes] = await Promise.all([
      this.routeDetailsService.getRoutesForSingleStation(stationTitle),
      this.routesRepository.findByStation(stationTitle),
    ]);
    const wayStationRouteIds = wayStationRoutes.map(({ route }) => route.id);
    const edgeStationRouteIds = edgeStationRoutes.map((route) => route.id);
    return [...wayStationRouteIds, ...edgeStationRouteIds];
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
