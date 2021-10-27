import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Route } from '../routes/routes.entity';
import { Station } from '../stations/stations.entity';
import { StationsService } from '../stations/stations.service';
import { CreateWayStationDto } from './dto/create-waystation.dto';
import { UpdateWayStationDto } from './dto/update-waystation.dto';
import { RouteDetailsRepository } from './route-details.repository';
import { RouteDetail } from './routeDetails.entity';

@Injectable()
export class RouteDetailsService {
  constructor(
    private routeDetailsRepository: RouteDetailsRepository,
    private stationService: StationsService,
  ) {}

  getRouteDetailsByRoute(route: Route) {
    return this.routeDetailsRepository.find({ where: { route } });
  }

  getWayStationsByRoute(routeID: string): Promise<RouteDetail[]> {
    return this.routeDetailsRepository.find({ where: { route: routeID } });
  }

  async getRoutesForSingleStation(stationTitle: string) {
    const wayStation = await this.stationService.getStationByName(stationTitle);
    return this.routeDetailsRepository.find({ where: { wayStation } });
  }

  async getRoutesByTwoWayStations(departure: Station, arrival: Station) {
    const routeDetails =
      await this.routeDetailsRepository.findWayStationsOnOneRoute(
        departure,
        arrival,
      );
    const routes = {};
    for (const routeDetail of routeDetails) {
      const { route, wayStation, stationOrder } = routeDetail;
      const key = wayStation === departure.id ? 'departure' : 'arrival';
      routes[route] = routes[route]
        ? { ...routes[route], [key]: stationOrder }
        : { [key]: stationOrder };

      if (routes[route]?.departure > routes[route]?.arrival) {
        delete routes[route];
      }
    }
    return Object.keys(routes);
  }

  async addWayStation(
    route: Route,
    wayStationData: CreateWayStationDto,
  ): Promise<RouteDetail> {
    const { stationOrder, time, stationTitle } = wayStationData;
    const wayStation = await this.stationService.getStationByName(stationTitle);
    if (!wayStation)
      throw new BadRequestException(`${stationTitle} station does not exist!`);
    const newRouteDetail = this.routeDetailsRepository.create({
      route,
      stationOrder,
      wayStation,
      timeOffset: time,
    });
    await this.routeDetailsRepository.save(newRouteDetail);
    return newRouteDetail;
  }

  async updateWayStation(
    route: Route,
    stationOrder: number,
    body: UpdateWayStationDto,
  ): Promise<void> {
    const wayStation = await this.stationService.getStationByName(
      body.wayStation,
    );
    if (!wayStation)
      throw new BadRequestException(`${wayStation} station does not exist!`);
    const { affected } = await this.routeDetailsRepository.update(
      { route, stationOrder },
      { ...body, wayStation },
    );
    if (!affected)
      throw new NotFoundException(
        `Way station #${stationOrder} for route ${route} not found!`,
      );
  }

  async deleteWayStation(route: Route, stationOrder: number) {
    const { affected } = await this.routeDetailsRepository.delete({
      route,
      stationOrder,
    });
    if (!affected)
      throw new NotFoundException(
        `Way station #${stationOrder} for route ${route} not found!`,
      );
  }
}
