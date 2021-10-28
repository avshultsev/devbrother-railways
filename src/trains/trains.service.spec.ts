import { Test } from '@nestjs/testing';
import { CarriagesService } from '../carriages/carriages.service';
import { Route } from '../routes/routes.entity';
import { RoutesService } from '../routes/routes.service';
import { Station } from '../stations/stations.entity';
import { TrainFrequenciesService } from '../train-frequencies/train-frequencies.service';
import { TrainFrequencyEnum } from '../train-frequencies/train-frequency.enum';
import { Roles } from '../users/roles.enum';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { DateParser } from './date-parser.service';
import { TrainType } from './train-type.enum';
import { TrainRepository } from './train.repository';
import { Train } from './trains.entity';
import { TrainsService } from './trains.service';

const mockRepoFactory = () => ({
  findOne: jest.fn(),
  findTrainsByRoutes: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('Thr Trains Service', () => {
  let trainsService: TrainsService;
  let usersService: UsersService;
  let dateParser: DateParser;
  let routesService: RoutesService;
  let carriagesService: CarriagesService;
  let trainFrequenciesService: TrainFrequenciesService;
  let mockRepository: { [fn: string]: jest.Mock };
  let getByEmail: jest.Mock;
  let getFullRouteInfo: jest.Mock;
  let getRoutesByStations: jest.Mock;
  let getRoutesPassingThroughStation: jest.Mock;
  let getRouteById: jest.Mock;
  let getTrainsWithFreeSeats: jest.Mock;
  let getTrainFreeSeats: jest.Mock;
  let getFrequenciesByTrainNumber: jest.Mock;
  let train: Train;
  let frequencies: TrainFrequencyEnum[];
  let user: User;
  let route: Route;
  let station: Station;

  beforeEach(async () => {
    getByEmail = jest.fn();
    getFullRouteInfo = jest.fn();
    getRoutesByStations = jest.fn();
    getRoutesPassingThroughStation = jest.fn();
    getRouteById = jest.fn();
    getTrainsWithFreeSeats = jest.fn();
    getTrainFreeSeats = jest.fn();
    getFrequenciesByTrainNumber = jest.fn();

    station = { id: '1', title: 'A' };
    frequencies = [TrainFrequencyEnum.THU];
    user = {
      email: '1',
      id: '1',
      password: '123456',
      role: Roles.PASSENGER,
    };
    route = {
      arrivalPoint: station,
      departurePoint: station,
      id: '1',
      travelTime: 1,
    };
    train = {
      type: TrainType.PASSENGER,
      departureTime: new Date(),
      lead: user,
      machenist: user,
      machenistAssistant: user,
      number: 123,
      route,
    };

    const module = await Test.createTestingModule({
      providers: [
        TrainsService,
        DateParser,
        {
          provide: UsersService,
          useValue: { getByEmail },
        },
        {
          provide: RoutesService,
          useValue: {
            getFullRouteInfo,
            getRoutesByStations,
            getRoutesPassingThroughStation,
            getRouteById,
          },
        },
        {
          provide: CarriagesService,
          useValue: { getTrainsWithFreeSeats, getTrainFreeSeats },
        },
        {
          provide: TrainFrequenciesService,
          useValue: { getFrequenciesByTrainNumber },
        },
        {
          provide: TrainRepository,
          useFactory: mockRepoFactory,
        },
      ],
    }).compile();

    trainsService = module.get(TrainsService);
    dateParser = module.get(DateParser);
    usersService = module.get(UsersService);
    routesService = module.get(RoutesService);
    carriagesService = module.get(CarriagesService);
    trainFrequenciesService = module.get(TrainFrequenciesService);
    mockRepository = module.get(TrainRepository);
  });

  // getTrainByNumber
  describe('when getting a train by number', () => {
    beforeEach(() => {
      mockRepository.findOne.mockResolvedValue(train);
      getFrequenciesByTrainNumber.mockResolvedValue(frequencies);
    });
    it('should return train info and its frequencies', async () => {
      const { frequencies: trainFreqs, ...trainInfo } =
        await trainsService.getTrainByNumber(1);
      expect(trainInfo).toEqual(train);
      expect(trainFreqs).toBe(frequencies);
    });
  });

  // getTrainsFilteredByDateAndFreeSeats
  describe('when getting trains filtered by date and free seats', () => {
    beforeEach(() => {
      getRoutesByStations.mockResolvedValue([route.id]);
      mockRepository.findTrainsByRoutes.mockResolvedValue([train]);
      getFrequenciesByTrainNumber.mockResolvedValue(frequencies);
      getTrainsWithFreeSeats.mockResolvedValue([train.number]);
    });
    it('should return an array of trains', async () => {
      const trains = await trainsService.getTrainsFilteredByDateAndFreeSeats(
        'A',
        'B',
        new Date(),
      );
      expect(trains).toHaveLength(1);
      expect(trains[0]).toEqual({ ...train, frequency: [...frequencies] });
    });
  });

  // getTrainsFilteredByFreeSeats
  describe('when getting trains filtered by free seats', () => {
    beforeEach(() => {
      getTrainsWithFreeSeats.mockResolvedValue([train.number]);
    });
    it('should return an array of trains', async () => {
      const fetchedTrains = await trainsService.getTrainsFilteredByFreeSeats([
        train,
      ]);
      expect(fetchedTrains).toHaveLength(1);
      expect(fetchedTrains[0]).toBe(train);
    });
  });

  // getTrainsFilteredByDate
  describe('when getting trains filtered by date', () => {
    beforeEach(() => {
      getRoutesByStations.mockResolvedValue([route.id]);
      mockRepository.findTrainsByRoutes.mockResolvedValue([train]);
      getFrequenciesByTrainNumber.mockResolvedValue(frequencies);
    });
    it('should return an array of trains with frequencies', async () => {
      const trainsWithFreqs = await trainsService.getTrainsFilteredByDate(
        'A',
        'A',
        new Date(),
      );
      console.log(trainsWithFreqs);
      const { frequency: trainFreq, ...trainInfo } = trainsWithFreqs[0];
      expect(trainFreq[0]).toBe(frequencies[0]);
      expect(trainInfo).toEqual(train);
    });
  });

  // getTrainFreeSeats
  describe('', () => {
    // TODO
  });

  // getTrainTimetable
  describe('', () => {
    // TODO
  });

  // getTrainsByTwoStationsWithFrequencies
  describe('', () => {
    // TODO
  });

  // getTrainsTimetableWithFrequencies
  describe('', () => {
    // TODO
  });

  // addTrain
  describe('', () => {
    // TODO
  });
});
