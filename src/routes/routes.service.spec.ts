import { Test } from '@nestjs/testing';
import { RouteDetailsService } from '../route-details/route-details.service';
import { RouteDetail } from '../route-details/routeDetails.entity';
import { Station } from '../stations/stations.entity';
import { StationsService } from '../stations/stations.service';
import { CreateRouteDto } from './dto/create-route.dto';
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
  let station_A: Station;
  let station_B: Station;

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
    station_A = { id: '2', title: 'A' };
    station_B = { id: '3', title: 'B' };
    route = {
      id: '1',
      arrivalPoint: station_A,
      departurePoint: station_B,
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
    beforeEach(() => {
      getStationByName.mockResolvedValue({ id: '1' });
    });

    describe('and when routes were found', () => {
      beforeEach(() => {
        mockRepository.find.mockResolvedValue([{ id: 'routeByEdgeStations' }]);
        mockRepository.findByMixedStations.mockResolvedValue([
          {
            id: 'routeByMixedStations',
          },
        ]);
        getRoutesByTwoWayStations.mockResolvedValue(['routeByTwoWayStations']);
      });
      it('should return an array of routes', async () => {
        const routes = await routesService.getRoutesByStations('1', '2');
        expect(routes).toHaveLength(3);
      });
    });

    describe('and when routes were not found', () => {
      beforeEach(() => {
        mockRepository.find.mockResolvedValue([]);
        mockRepository.findByMixedStations.mockResolvedValue([]);
        getRoutesByTwoWayStations.mockResolvedValue([]);
      });
      it('should throw an error', async () => {
        await expect(
          routesService.getRoutesByStations('A', 'B'),
        ).rejects.toThrow();
      });
    });
  });

  // getRoutesPassingThroughStation
  describe('when getting routes passing through the station', () => {
    beforeEach(() => {
      getRoutesForSingleStation.mockResolvedValue([{ route: { id: '1' } }]);
      mockRepository.findByStation.mockReturnValue([{ id: '2' }]);
    });
    it('should return an array of route ids', async () => {
      const routes = await routesService.getRoutesPassingThroughStation('abc');
      expect(routes).toHaveLength(2);
    });
  });

  // getFullRouteInfo
  describe('when getting full route info', () => {
    let routeDetail_1: RouteDetail;
    let routeDetail_2: RouteDetail;

    beforeEach(() => {
      routeDetail_1 = {
        id: '100',
        stationOrder: 1,
        route,
        timeOffset: 1,
        wayStation: { id: '2', title: 'Title' },
      };
      routeDetail_2 = { ...routeDetail_1, stationOrder: 2 };
      mockRepository.findOne.mockResolvedValue(route);
      getRouteDetailsByRoute.mockResolvedValue([routeDetail_1, routeDetail_2]);
    });
    it('should return route info and sorted route details', async () => {
      const { routeDetails, routeInfo } = await routesService.getFullRouteInfo(
        route,
      );
      expect(routeInfo).toBe(route);
      expect(routeDetails).toHaveLength(2);
      expect(routeDetails[0]).toHaveProperty('stationOrder', 1);
      expect(routeDetails[1]).toHaveProperty('stationOrder', 2);
    });
  });

  // createRoute
  describe('when creating a route', () => {
    const createRouteData: CreateRouteDto = {
      arrivalPoint: 'a',
      departurePoint: 'b',
      travelTime: 1,
    };

    describe('and when both endpoints exist', () => {
      beforeEach(() => {
        getStationByName.mockResolvedValue(station_A);
        mockRepository.create.mockResolvedValue(route);
        mockRepository.save.mockResolvedValue(() => null);
      });
      it('should return a new route', async () => {
        const newRoute = await routesService.createRoute(createRouteData);
        expect(newRoute).toBe(route);
      });
    });

    describe('and one of the endpoints does not exist', () => {
      beforeEach(() => {
        getStationByName
          .mockResolvedValueOnce(station_A)
          .mockResolvedValueOnce(null);
      });
      it('should throw an error', async () => {
        await expect(
          routesService.createRoute(createRouteData),
        ).rejects.toThrow();
      });
    });
  });

  // deleteRoute
  describe('when deleting a route', () => {
    const fn: (affected: number) => jest.Mock = (affected) =>
      mockRepository.delete.mockReturnValue({ affected });
    describe('and the route was found', () => {
      beforeEach(() => {
        fn(1);
      });
      it('should return undefined', async () => {
        const result = await routesService.deleteRoute('1');
        expect(result).toBe(undefined);
      });
    });

    describe('and the route was not found', () => {
      beforeEach(() => {
        fn(0);
      });
      it('should throw an error', async () => {
        await expect(routesService.deleteRoute('1')).rejects.toThrow();
      });
    });
  });
});
