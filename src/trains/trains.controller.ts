import { Body, Controller, ParseIntPipe, Post } from '@nestjs/common';
import { AddTrainDto } from './dto/addTrain.dto';
import { TrainsService } from './trains.service';

@Controller('trains')
export class TrainsController {
  constructor(private trainsService: TrainsService) {}

  @Post()
  addTrain(
    @Body('number', ParseIntPipe) number: number,
    @Body() trainData: AddTrainDto,
  ) {
    return this.trainsService.addTrain({ ...trainData, number });
  }
}
