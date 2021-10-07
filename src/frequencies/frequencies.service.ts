import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrainFrequencyEnum } from 'src/train-frequencies/train-frequency.enum';
import { Repository } from 'typeorm';
import { Frequency } from './frequency.entity';

@Injectable()
export class FrequenciesService {
  constructor(
    @InjectRepository(Frequency)
    private frequencyRepository: Repository<Frequency>,
  ) {}

  async getFrequency(name: TrainFrequencyEnum) {
    const frequency = await this.frequencyRepository.findOne({
      where: { name },
    });
    if (!frequency) throw new BadRequestException(`Invalid frequency title!`);
    return frequency;
  }

  async addFrequency(name: TrainFrequencyEnum) {
    const newFreq = this.frequencyRepository.create({ name });
    await this.frequencyRepository.save(newFreq);
    return newFreq;
  }
}
