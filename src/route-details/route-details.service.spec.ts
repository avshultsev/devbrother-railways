import { Test, TestingModule } from '@nestjs/testing';
import { RouteDetailsService } from './route-details.service';

describe('RouteDetailsService', () => {
  let service: RouteDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RouteDetailsService],
    }).compile();

    service = module.get<RouteDetailsService>(RouteDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
