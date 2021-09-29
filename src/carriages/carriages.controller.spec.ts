import { Test, TestingModule } from '@nestjs/testing';
import { CarriagesController } from './carriages.controller';

describe('CarriagesController', () => {
  let controller: CarriagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarriagesController],
    }).compile();

    controller = module.get<CarriagesController>(CarriagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
