import { Test, TestingModule } from '@nestjs/testing';
import { CarriagesService } from './carriages.service';

describe('CarriagesService', () => {
  let service: CarriagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarriagesService],
    }).compile();

    service = module.get<CarriagesService>(CarriagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
