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
import { DateTransformPipe } from './pipes/date-transform.pipe';
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
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('date', DateTransformPipe) date: Date,
  ) {
    return this.trainsService.getTrainsFilteredByDateAndFreeSeats(
      start,
      end,
      date,
    );
  }

  @Get('/:stationTitle/timetable')
  getTrainsTimetableForStation(@Param('stationTitle') stationTitle: string) {
    return this.trainsService.getTrainsTimetableWithFrequencies(stationTitle);
  }

  @Get('/:trainNumber/seats')
  getTrainFreeSeats(@Param('trainNumber', ParseIntPipe) trainNumber: number) {
    return this.trainsService.getTrainFreeSeats(trainNumber);
  }

  @Post()
  addTrain(
    @Body('number', ParseIntPipe) number: number,
    @Body() trainData: AddTrainDto,
  ) {
    return this.trainsService.addTrain({ ...trainData, number });
  }
}
