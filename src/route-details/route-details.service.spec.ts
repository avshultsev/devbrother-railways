import { Test } from '@nestjs/testing';
import { Route } from '../routes/routes.entity';
import { Station } from '../stations/stations.entity';
import { StationsService } from '../stations/stations.service';
import { RouteDetailsRepository } from './route-details.repository';
import { RouteDetailsService } from './route-details.service';
import { RouteDetail } from './routeDetails.entity';

const mockRepoFactory = () => ({
  find: jest.fn(),
  findWayStationsOnOneRoute: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('The RouteDetails Service', () => {
  let routeDetailsService: RouteDetailsService;
  let mockRepository: { [n: string]: jest.Mock };
  let getStationByName: jest.Mock;
  let routeDetail: RouteDetail;
  let route: Route;
  let station: Station;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RouteDetailsService,
        {
          provide: RouteDetailsRepository,
          useFactory: mockRepoFactory,
        },
        {
          provide: StationsService,
          useValue: { getStationByName },
        },
      ],
    }).compile();

    routeDetailsService = module.get(RouteDetailsService);
    mockRepository = module.get(RouteDetailsRepository);
    station = { id: '1', title: 'A' };
    route = {
      id: '1',
      arrivalPoint: station,
      departurePoint: station,
      travelTime: 1,
    };
    routeDetail = {
      id: '1',
      route,
      stationOrder: 1,
      timeOffset: 1,
      wayStation: station,
    };
  });

  // getRouteDetailsByRoute
  describe('when getting route details by route', () => {
    beforeEach(() => {
      mockRepository.find.mockResolvedValue([routeDetail]);
    });
    it('should return an array of route details', async () => {
      const routeDetails = await routeDetailsService.getRouteDetailsByRoute(
        route,
      );
      expect(routeDetails).toHaveLength(1);
    });
  });
});
