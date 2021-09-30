import { Test, TestingModule } from '@nestjs/testing';
import { TrainFrequenciesController } from './train-frequencies.controller';

describe('TrainFrequenciesController', () => {
  let controller: TrainFrequenciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainFrequenciesController],
    }).compile();

    controller = module.get<TrainFrequenciesController>(TrainFrequenciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
