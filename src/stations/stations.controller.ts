import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateStationDto } from './dto/create-station.dto';
import { Station } from './stations.entity';
import { StationsService } from './stations.service';

@Controller('stations')
export class StationsController {
  constructor(private stationsService: StationsService) {}

  @Get()
  getAllStations(@Query('title') title: string): Promise<Station[]> {
    if (title) return this.stationsService.getStationsWithFilter(title);
    return this.stationsService.getAllStations();
  }

  @Get('/:id')
  getStationById(@Param('id') id: string) {
    return this.stationsService.getStationById(id);
  }

  @Post()
  createStation(@Body() station: CreateStationDto) {
    return this.stationsService.createStation(station);
  }

  @Delete('/:id')
  deleteStation(@Param('id') id: string) {
    return this.stationsService.deleteStation(id);
  }
}
