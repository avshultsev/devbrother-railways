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

  async getRoutesByStation(stationTitle: string): Promise<Route[]> {
    const [wayStationRoutes, edgeStationRoutes] = await Promise.all([
      this.routeDetailsService.getRoutesByWayStation(stationTitle),
      this.routesRepository.findByStation(stationTitle),
    ]);
    return [...wayStationRoutes, ...edgeStationRoutes];
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
