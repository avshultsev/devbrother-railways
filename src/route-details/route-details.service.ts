import { Injectable } from '@nestjs/common';
import { Route } from 'src/routes/routes.entity';
import { CreateWayStationDto } from './dto/create-waystation.dto';
import { RouteDetailsRepository } from './route-details.repository';
import { RouteDetail } from './routeDetails.entity';

@Injectable()
export class RouteDetailsService {
  constructor(private routeDetailsRepository: RouteDetailsRepository) {}

  getWayStations(routeID: string): Promise<RouteDetail[]> {
    return this.routeDetailsRepository.find({ where: { route: routeID } });
  }

  async addWayStation(
    route: Route,
    wayStationData: CreateWayStationDto,
  ): Promise<RouteDetail> {
    const { stationOrder, time, wayStation } = wayStationData;
    const newRouteDetail = this.routeDetailsRepository.create({
      route,
      stationOrder,
      wayStation,
      time,
    });
    await this.routeDetailsRepository.save(newRouteDetail);
    return newRouteDetail;
  }
}
