import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { AddTrainDto } from './dto/addTrain.dto';
import { TrainsService } from './trains.service';

@Controller('trains')
export class TrainsController {
  constructor(private trainsService: TrainsService) {}

  @Get('/:trainNumber')
  getTrainByNumber(@Param('trainNumber', ParseIntPipe) trainNumber: number) {
    return this.trainsService.getTrainByNumber(trainNumber);
  }

  @Get()
  getTrainsByStations(
    @Query('departure') departure: string,
    @Query('arrival') arrival: string,
  ) {
    return this.trainsService.getTrainsByStations(departure, arrival);
  }

  @Get('/:stationTitle/timetable')
  getTrainTimetable(@Param('stationTitle') stationTitle: string) {
    return this.trainsService.getTrainsForStation(stationTitle);
  }

  @Post()
  addTrain(
    @Body('number', ParseIntPipe) number: number,
    @Body() trainData: AddTrainDto,
  ) {
    return this.trainsService.addTrain({ ...trainData, number });
  }
}
