import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { TrainFrequenciesService } from './train-frequencies.service';
import { TrainFrequencyEnum } from './train-frequency.enum';

@Controller('train-frequencies')
export class TrainFrequenciesController {
  constructor(private trainFrequenciesService: TrainFrequenciesService) {}

  @Get('/:trainNumber')
  getTrainFrequencies(@Param('trainNumber', ParseIntPipe) trainNumber: number) {
    return this.trainFrequenciesService.getFrequenciesByTrainNumber(
      trainNumber,
    );
  }

  @Post('/:trainNumber')
  addTrainFrequency(
    @Param('trainNumber', ParseIntPipe) trainNumber: number,
    @Body('frequencyName') frequencyName: TrainFrequencyEnum,
  ) {
    return this.trainFrequenciesService.addTrainFrequency(
      trainNumber,
      frequencyName,
    );
  }
}
