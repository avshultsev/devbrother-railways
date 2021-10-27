import { Test } from '@nestjs/testing';
import { Station } from './stations.entity';
import { StationsRepository } from './stations.repository';
import { StationsService } from './stations.service';

const mockRepoFactory = () => ({
  find: jest.fn(),
  findWithFilter: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('The StationsService', () => {
  let stationsService: StationsService;
  let mockRepository: { [n: string]: jest.Mock };
  let station: Station;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        StationsService,
        {
          provide: StationsRepository,
          useFactory: mockRepoFactory,
        },
      ],
    }).compile();

    stationsService = module.get(StationsService);
    mockRepository = module.get(StationsRepository);
  });

  // getAllStations
  describe('when getting all stations', () => {
    let stations: Station[];
    beforeEach(() => {
      stations = [{ id: 'station1', title: 'Kyiv' }];
      mockRepository.find.mockResolvedValue(stations);
    });
    it('should return an array of stations', async () => {
      const stations = await stationsService.getAllStations();
      expect(stations).toHaveLength(1);
    });
  });

  // getStationsWithFilter
  describe('when getting stations with filter', () => {
    beforeEach(() => {
      mockRepository.findWithFilter.mockResolvedValue([station]);
    });
    it('should return an array of stations', async () => {
      const stations = await stationsService.getStationsWithFilter('whatever');
      expect(stations).toHaveLength(1);
    });
  });

  // getStationById
  describe('when getting station by id', () => {
    describe('and the station was found', () => {
      beforeEach(() => {
        station = { id: '1', title: 'Kyiv' };
        mockRepository.findOne.mockResolvedValue(station);
      });
      it('should return the station', async () => {
        const fetchedStation = await stationsService.getStationById('whatever');
        expect(fetchedStation).toBe(station);
      });
    });

    describe('and the station was not found', () => {
      beforeEach(() => {
        mockRepository.findOne.mockResolvedValue(null);
      });
      it('should throw an error', async () => {
        await expect(
          stationsService.getStationById('whatever'),
        ).rejects.toThrow();
      });
    });
  });

  // getStationByName
  describe('when getting station by name', () => {
    describe('and the station was found', () => {
      beforeEach(() => {
        station = { id: '1', title: 'Kyiv' };
        mockRepository.findOne.mockResolvedValue(station);
      });
      it('should return the station', async () => {
        const fetchedStation = await stationsService.getStationByName('123');
        expect(fetchedStation).toBe(station);
      });
    });

    describe('and the station was not found', () => {
      beforeEach(() => {
        mockRepository.findOne.mockResolvedValue(null);
      });
      it('should throw an error', async () => {
        await expect(
          stationsService.getStationByName('whatever'),
        ).rejects.toThrow();
      });
    });
  });

  // createStation
  describe('when creating a station', () => {
    beforeEach(() => {
      mockRepository.create.mockResolvedValue(station);
      mockRepository.save.mockImplementation(() => null);
    });
    it('should return a station', async () => {
      const createdStation = await stationsService.createStation({
        title: 'whatever',
      });
      expect(createdStation).toBe(station);
    });
  });

  // deleteStation
  describe('when deleting a station', () => {
    let mockDelete: (affected: number) => jest.Mock;

    beforeEach(() => {
      mockDelete = (affected: number) =>
        mockRepository.delete.mockResolvedValue({ affected });
    });

    describe('when the station was found', () => {
      beforeEach(() => {
        mockDelete(1);
      });
      it('should return undefined', async () => {
        const result = await stationsService.deleteStation('1');
        expect(result).toBe(undefined);
      });
    });

    describe('when the station was not found', () => {
      beforeEach(() => {
        mockDelete(0);
      });
      it('should throw an error', async () => {
        await expect(stationsService.deleteStation('1')).rejects.toThrow();
      });
    });
  });
});
