import { Test } from '@nestjs/testing';
import { Route } from '../routes/routes.entity';
import { Station } from '../stations/stations.entity';
import { StationsService } from '../stations/stations.service';
import { CreateWayStationDto } from './dto/create-waystation.dto';
import { UpdateWayStationDto } from './dto/update-waystation.dto';
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
    getStationByName = jest.fn();
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

  // getWayStationsByRoute
  describe('when getting way stations by route', () => {
    beforeEach(() => {
      mockRepository.find.mockResolvedValue([routeDetail]);
    });
    it('should return an array of route details', async () => {
      const routeDetails = await routeDetailsService.getWayStationsByRoute('1');
      expect(routeDetails).toHaveLength(1);
      expect(routeDetails[0]).toHaveProperty('route', route);
    });
  });

  // getRoutesForSingleStation
  describe('when getting routes for single station', () => {
    beforeEach(() => {
      getStationByName.mockResolvedValue('station');
      mockRepository.find.mockResolvedValue([routeDetail]);
    });
    it('should return an array of route details', async () => {
      const routeDetails = await routeDetailsService.getRoutesForSingleStation(
        'stationTitle',
      );
      expect(routeDetails).toHaveLength(1);
    });
  });

  // getRoutesByTwoWayStations
  describe('when getting routes by two way stations', () => {
    beforeEach(() => {
      mockRepository.findWayStationsOnOneRoute.mockReturnValue([
        { ...routeDetail, wayStation: station.id, route: route.id },
      ]);
    });
    it('should return an array of route ids', async () => {
      const routeIDs = await routeDetailsService.getRoutesByTwoWayStations(
        station,
        station,
      );
      expect(routeIDs).toHaveLength(1);
      expect(routeIDs[0]).toEqual(route.id);
    });
  });

  // addWayStation
  describe('when adding way station', () => {
    let wayStationData: CreateWayStationDto;
    beforeEach(() => {
      wayStationData = {
        stationOrder: 1,
        stationTitle: 'A',
        time: 1,
      };
    });

    describe('and such way station exists', () => {
      beforeEach(() => {
        getStationByName.mockResolvedValue(station);
        mockRepository.create.mockResolvedValue(routeDetail);
        mockRepository.save.mockImplementation(() => null);
      });
      it('should return new route detail', async () => {
        const newRouteDetail = await routeDetailsService.addWayStation(
          route,
          wayStationData,
        );
        expect(newRouteDetail).toBe(routeDetail);
      });
    });

    describe('and such way station does not exist', () => {
      beforeEach(() => {
        getStationByName.mockResolvedValue(null);
      });
      it('should throw an exception', async () => {
        await expect(
          routeDetailsService.addWayStation(route, wayStationData),
        ).rejects.toThrow();
      });
    });
  });

  // updateWayStation
  describe('when updating way station', () => {
    let fn: (affected: number) => jest.Mock;
    let updateWayStationData: UpdateWayStationDto;
    beforeEach(() => {
      fn = (affected) => mockRepository.update.mockResolvedValue({ affected });
      updateWayStationData = {
        stationOrder: 1,
        time: 1,
        wayStation: 'station',
      };
    });

    describe('and station and route detail was found', () => {
      beforeEach(() => {
        getStationByName.mockResolvedValue(station);
        fn(1);
      });
      it('should return undefined', async () => {
        const result = await routeDetailsService.updateWayStation(
          route,
          1,
          updateWayStationData,
        );
        expect(result).toBe(undefined);
      });
    });
    describe('and station was not found', () => {
      beforeEach(() => {
        getStationByName.mockResolvedValue(null);
      });
      it('should throw an error', async () => {
        await expect(
          routeDetailsService.updateWayStation(route, 1, updateWayStationData),
        ).rejects.toThrow();
      });
    });
    describe('and route detail was not found', () => {
      beforeEach(() => {
        getStationByName.mockResolvedValue(station);
        fn(0);
      });
      it('should throw an error', async () => {
        await expect(
          routeDetailsService.updateWayStation(route, 1, updateWayStationData),
        ).rejects.toThrow();
      });
    });
  });

  // deleteWayStation
  describe('when deleting way station', () => {
    let fn: (affected: number) => jest.Mock;
    beforeEach(() => {
      fn = (affected) => mockRepository.delete.mockResolvedValue({ affected });
    });
    describe('and way station was found', () => {
      beforeEach(() => {
        fn(1);
      });
      it('should return undefined', async () => {
        const result = await routeDetailsService.deleteWayStation(route, 1);
        expect(result).toBe(undefined);
      });
    });

    describe('and way station was not found', () => {
      beforeEach(() => {
        fn(0);
      });
      it('should throw an error', async () => {
        await expect(
          routeDetailsService.deleteWayStation(route, 1),
        ).rejects.toThrow();
      });
    });
  });
});
