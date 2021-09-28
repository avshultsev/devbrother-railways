import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StationsService } from 'src/stations/stations.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { Route } from './routes.entity';
import { RoutesRepository } from './routes.repository';

@Injectable()
export class RoutesService {
  constructor(
    private routesRepository: RoutesRepository,
    private stationService: StationsService,
  ) {}

  getRouteById(id: string): Promise<Route> {
    return this.routesRepository.findOne(id);
  }

  getRoutesByStation(stationTitle: string): Promise<Route[]> {
    return this.routesRepository.findByStation(stationTitle);
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
