import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FrequenciesService } from 'src/frequencies/frequencies.service';
import { TrainsService } from 'src/trains/trains.service';
import { Repository } from 'typeorm';
import { TrainFrequency } from './train-frequency.entity';
import { TrainFrequencyEnum } from './train-frequency.enum';

@Injectable()
export class TrainFrequenciesService {
  constructor(
    @InjectRepository(TrainFrequency)
    private trainFrequencyRepository: Repository<TrainFrequency>,
    private trainsService: TrainsService,
    private frequenciesService: FrequenciesService,
  ) {}

  async getFrequenciesByTrainNumber(trainNumber: number) {
    const train = await this.trainsService.getTrainByNumber(trainNumber);
    return this.trainFrequencyRepository.find({
      where: { train },
    });
  }

  async addTrainFrequency(
    trainNumber: number,
    frequencyName: TrainFrequencyEnum,
  ) {
    const promises: Promise<any>[] = [
      this.trainsService.getTrainByNumber(trainNumber),
      this.frequenciesService.getFrequency(frequencyName),
    ];
    const [train, frequency] = await Promise.all(promises);
    const newTrainFrequency = this.trainFrequencyRepository.create({
      train,
      frequency,
    });
    await this.trainFrequencyRepository.save(newTrainFrequency);
    return newTrainFrequency;
  }
}
