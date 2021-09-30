import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { AddTrainDto } from './dto/addTrain.dto';
import { TrainsService } from './trains.service';

@Controller('trains')
export class TrainsController {
  constructor(private trainsService: TrainsService) {}

  @Get('')
  getTrain(@Query('trainNumber', ParseIntPipe) trainNumber: number) {
    return this.trainsService.getTrainByNumber(trainNumber);
  }

  @Post()
  addTrain(
    @Body('number', ParseIntPipe) number: number,
    @Body() trainData: AddTrainDto,
  ) {
    return this.trainsService.addTrain({ ...trainData, number });
  }
}
