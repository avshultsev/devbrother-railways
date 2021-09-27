import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Route } from 'src/routes/routes.entity';
import { CreateWayStationDto } from './dto/create-waystation.dto';
import { RouteDetailsService } from './route-details.service';

@Controller('route-details')
export class RouteDetailsController {
  constructor(private routeDetailsService: RouteDetailsService) {}

  @Get()
  getWayStations(@Query('route') route: string) {
    return this.routeDetailsService.getWayStations(route);
  }

  @Post('/:id')
  addWayStation(
    @Param('id') id: Route,
    @Body() wayStationData: CreateWayStationDto,
  ) {
    return this.routeDetailsService.addWayStation(id, wayStationData);
  }
}
