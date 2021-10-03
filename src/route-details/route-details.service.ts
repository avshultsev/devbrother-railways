import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Route } from 'src/routes/routes.entity';
import { StationsService } from 'src/stations/stations.service';
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

  getWayStations(routeID: string): Promise<RouteDetail[]> {
    return this.routeDetailsRepository.find({ where: { route: routeID } });
  }

  getRoutesByWayStation(stationTitle: string) {
    return this.routeDetailsRepository.findRouteByWayStation(stationTitle);
  }

  async getWayStationsOnOneRoute(start: string, end: string) {
    const { getStationByName } = this.stationService;
    const toPromise: typeof getStationByName = getStationByName.bind(
      this.stationService,
    );
    const promises = [start, end].map(toPromise);
    const [departure, arrival] = await Promise.all(promises);
    const results = await this.routeDetailsRepository.findWayStationsOnOneRoute(
      departure,
      arrival,
    );
    const routes = {};
    for (const wayStation of results) {
      const { routeId, wayStationId: id, stationOrder } = wayStation;
      const key = id === departure.id ? 'departure' : 'arrival';
      const title = id === departure.id ? departure.title : arrival.title;
      routes[routeId] = routes[routeId]
        ? { ...routes[routeId], [key]: { title, stationOrder } }
        : { [key]: { title, stationOrder } };

      if (
        routes[routeId]?.departure?.stationOrder >
        routes[routeId]?.arrival?.stationOrder
      ) {
        delete routes[routeId];
      }
    }
    return routes;
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
