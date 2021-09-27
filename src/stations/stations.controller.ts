import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateStationDto } from './dto/create-station.dto';
import { Station } from './stations.entity';
import { StationsService } from './stations.service';

@Controller('stations')
export class StationsController {
  constructor(private stationsService: StationsService) {}

  // @UseGuards(JwtAuthGuard) // for endpoint test purposes only
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
