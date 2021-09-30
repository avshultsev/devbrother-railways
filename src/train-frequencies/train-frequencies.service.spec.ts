import { Test, TestingModule } from '@nestjs/testing';
import { TrainFrequenciesService } from './train-frequencies.service';

describe('TrainFrequenciesService', () => {
  let service: TrainFrequenciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainFrequenciesService],
    }).compile();

    service = module.get<TrainFrequenciesService>(TrainFrequenciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
