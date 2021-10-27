import { Test } from '@nestjs/testing';
import { RouteDetailsService } from '../route-details/route-details.service';
import { StationsService } from '../stations/stations.service';
import { Route } from './routes.entity';
import { RoutesRepository } from './routes.repository';
import { RoutesService } from './routes.service';

const mockRepoFactory = () => ({
  findOne: jest.fn(),
  findByMixedStations: jest.fn(),
  find: jest.fn(),
  findByStation: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('The Routes Service', () => {
  let routesService: RoutesService;
  let mockRepository: { [fn: string]: jest.Mock };
  let getStationByName: jest.Mock;
  let getRoutesByTwoWayStations: jest.Mock;
  let getRoutesForSingleStation: jest.Mock;
  let getRouteDetailsByRoute: jest.Mock;
  let route: Route;

  beforeEach(async () => {
    getStationByName = jest.fn();
    getRoutesByTwoWayStations = jest.fn();
    getRoutesForSingleStation = jest.fn();
    getRouteDetailsByRoute = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        RoutesService,
        {
          provide: StationsService,
          useValue: { getStationByName },
        },
        {
          provide: RouteDetailsService,
          useValue: {
            getRoutesByTwoWayStations,
            getRoutesForSingleStation,
            getRouteDetailsByRoute,
          },
        },
        {
          provide: RoutesRepository,
          useFactory: mockRepoFactory,
        },
      ],
    }).compile();

    routesService = module.get(RoutesService);
    mockRepository = module.get(RoutesRepository);
    route = {
      id: '1',
      arrivalPoint: { id: '2', title: 'A' },
      departurePoint: { id: '3', title: 'B' },
      travelTime: 1,
    };
  });

  // getRouteById
  describe('when getting route by id', () => {
    beforeEach(() => {
      mockRepository.findOne.mockResolvedValue(route);
    });
    it('should return route', async () => {
      const fetchedRoute = await routesService.getRouteById('123');
      expect(fetchedRoute).toBe(route);
    });
  });

  // getRoutesByStations
  describe('when getting routes by stations', () => {
    // TODO
  });

  // getRoutesPassingThroughStation
  describe('when getting routes passing through th station', () => {
    // TODO
  });

  // getFullRouteInfo
  describe('when getting full route info', () => {
    // TODO
  });

  // createRoute
  describe('when creating a route', () => {
    // TODO
  });

  // deleteRoute
  describe('when deleting a route', () => {
    // TODO
  });
});
