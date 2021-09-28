import { BadRequestException, Injectable } from '@nestjs/common';
import { Route } from 'src/routes/routes.entity';
import { StationsService } from 'src/stations/stations.service';
import { CreateWayStationDto } from './dto/create-waystation.dto';
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
      time,
    });
    await this.routeDetailsRepository.save(newRouteDetail);
    return newRouteDetail;
  }
}
