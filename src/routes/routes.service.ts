import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { Route } from './routes.entity';
import { RoutesRepository } from './routes.repository';

@Injectable()
export class RoutesService {
  constructor(private routesRepository: RoutesRepository) {}

  getRouteById(id: string): Promise<Route> {
    return this.routesRepository.findOne(id);
  }

  getRoutesByStation(stationTitle: string): Promise<Route[]> {
    return this.routesRepository.findByStation(stationTitle);
  }

  async createRoute(route: CreateRouteDto): Promise<Route> {
    const newRoute = this.routesRepository.create(route);
    await this.routesRepository.save(newRoute);
    return newRoute;
  }

  async deleteRoute(id: string): Promise<void> {
    const { affected } = await this.routesRepository.delete(id);
    if (!affected)
      throw new NotFoundException(`Route with "${id}" id not found!`);
  }
}
