import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { RoutesService } from './routes.service';

@Controller('routes')
export class RoutesController {
  constructor(private routesService: RoutesService) {}

  @Get()
  getRoutesByStations(
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.routesService.getRoutesByStations(start, end);
  }

  @Get('/test')
  getMixedStations(@Query('start') start: string, @Query('end') end: string) {
    return this.routesService.findEdgeAndWayStations(start, end);
  }

  @Get('/:id')
  getRouteById(@Param('id') id: string) {
    return this.routesService.getRouteById(id);
  }

  @Post()
  createRoute(@Body() createRouteData: CreateRouteDto) {
    return this.routesService.createRoute(createRouteData);
  }

  @Delete('/:id')
  deleteRoute(@Param('id') id: string) {
    return this.routesService.deleteRoute(id);
  }
}
