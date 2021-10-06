import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Route } from 'src/routes/routes.entity';
import { CreateWayStationDto } from './dto/create-waystation.dto';
import { UpdateWayStationDto } from './dto/update-waystation.dto';
import { RouteDetailsService } from './route-details.service';

@Controller('route-details')
export class RouteDetailsController {
  constructor(private routeDetailsService: RouteDetailsService) {}

  @Get()
  getWayStationsByRoute(@Query('route') route: string) {
    return this.routeDetailsService.getWayStationsByRoute(route);
  }

  @Post('/:route')
  addWayStation(
    @Param('route') route: Route,
    @Body('stationOrder', ParseIntPipe) stationOrder: number,
    @Body('time', ParseIntPipe) time: number,
    @Body() wayStationData: CreateWayStationDto,
  ) {
    return this.routeDetailsService.addWayStation(route, {
      ...wayStationData,
      stationOrder,
      time,
    });
  }

  @Patch('/:route/stationOrder/:stationOrder')
  updateWayStation(
    @Param('route') route: Route,
    @Param('stationOrder', ParseIntPipe) stationOrder: number,
    @Body() payload: UpdateWayStationDto,
  ) {
    return this.routeDetailsService.updateWayStation(
      route,
      stationOrder,
      payload,
    );
  }

  @Delete('/:route/stationOrder/:stationOrder')
  deleteWayStation(
    @Param('route') route: Route,
    @Param('stationOrder', ParseIntPipe) stationOrder: number,
  ) {
    return this.routeDetailsService.deleteWayStation(route, stationOrder);
  }
}
