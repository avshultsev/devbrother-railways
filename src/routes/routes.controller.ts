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
  getRoutesByStation(@Query('station') stationTitle: string) {
    return this.routesService.getRoutesByStation(stationTitle);
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
