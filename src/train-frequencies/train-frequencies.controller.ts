import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { TrainFrequenciesService } from './train-frequencies.service';
import { AddFrequencyDto } from './dto/add-frequency.dto';
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
    @Body() payload: AddFrequencyDto,
  ) {
    const { frequencyName } = payload;
    return this.trainFrequenciesService.addTrainFrequency(train, frequencyName);
  }

  @Put()
  updateTrainFrequency(
    @Query('train', ParseIntPipe) train: number,
    @Body() payload: AddFrequencyDto,
  ) {
    const { frequencyName } = payload;
    return this.trainFrequenciesService.updateTrainFrequency(
      train,
      frequencyName,
    );
  }

  @Delete()
  deleteTrainFrequency(
    @Query('train', ParseIntPipe) train: number,
    @Query('frequency') frequency: TrainFrequencyEnum,
  ) {
    return this.trainFrequenciesService.deleteTrainFrequency(train, frequency);
  }
}
