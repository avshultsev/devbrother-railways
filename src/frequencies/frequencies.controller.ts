import { Body, Controller, Post } from '@nestjs/common';
import { TrainFrequencyEnum } from 'src/train-frequencies/train-frequency.enum';
import { FrequenciesService } from './frequencies.service';

@Controller('frequencies')
export class FrequenciesController {
  constructor(private freqService: FrequenciesService) {}

  @Post()
  addFrequency(@Body('name') name: TrainFrequencyEnum) {
    return this.freqService.addFrequency(name);
  }
}
