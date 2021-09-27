import { Test, TestingModule } from '@nestjs/testing';
import { RouteDetailsController } from './route-details.controller';

describe('RouteDetailsController', () => {
  let controller: RouteDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RouteDetailsController],
    }).compile();

    controller = module.get<RouteDetailsController>(RouteDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
