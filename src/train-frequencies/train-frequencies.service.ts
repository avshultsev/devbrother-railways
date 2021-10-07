import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FrequenciesService } from 'src/frequencies/frequencies.service';
import { Repository } from 'typeorm';
import { TrainFrequency } from './train-frequency.entity';
import { TrainFrequencyEnum } from './train-frequency.enum';

@Injectable()
export class TrainFrequenciesService {
  constructor(
    @InjectRepository(TrainFrequency)
    private trainFrequencyRepository: Repository<TrainFrequency>,
    private frequenciesService: FrequenciesService,
  ) {}

  getFrequenciesByTrainNumber(trainNumber: number) {
    return this.trainFrequencyRepository.find({
      where: { train: trainNumber },
    });
  }

  async addTrainFrequency(
    trainNumber: number,
    frequencyName: TrainFrequencyEnum,
  ) {
    try {
      const frequency = await this.frequenciesService.getFrequency(
        frequencyName,
      );
      const newTrainFrequency = this.trainFrequencyRepository.create({
        train: trainNumber,
        frequency,
      });
      await this.trainFrequencyRepository.save(newTrainFrequency);
      return newTrainFrequency;
    } catch (err) {
      throw err;
    }
  }

  async updateTrainFrequency(train: number, frequencyName: TrainFrequencyEnum) {
    await this.trainFrequencyRepository.delete({ train });
    return this.addTrainFrequency(train, frequencyName);
  }

  async deleteTrainFrequency(train: number, frequencyName: TrainFrequencyEnum) {
    const frequency = await this.frequenciesService.getFrequency(frequencyName);
    const { affected } = await this.trainFrequencyRepository.delete({
      train,
      frequency,
    });

    if (!affected)
      throw new NotFoundException(
        `Train ${train} with frequency ${frequencyName} not found!`,
      );
  }
}
