import { Injectable } from '@nestjs/common';
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

  getFrequency(name: TrainFrequencyEnum) {
    return this.frequencyRepository.findOne({ where: { name } });
  }
}
