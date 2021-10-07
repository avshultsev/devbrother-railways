import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TrainFrequenciesService } from './train-frequencies.service';
import { TrainFrequencyEnum } from './train-frequency.enum';

@Controller('train-frequencies')
export class TrainFrequenciesController {
  constructor(private trainFrequenciesService: TrainFrequenciesService) {}

  @Get()
  getTrainFrequencies(@Query('train', ParseIntPipe) train: number) {
    return this.trainFrequenciesService.getFrequenciesByTrainNumber(train);
  }

  @Post()
  addTrainFrequency(
    @Query('train', ParseIntPipe) train: number,
    @Body('frequencyName') frequencyName: TrainFrequencyEnum,
  ) {
    return this.trainFrequenciesService.addTrainFrequency(train, frequencyName);
  }
}
