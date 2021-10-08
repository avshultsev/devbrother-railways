import { Injectable, NotFoundException } from '@nestjs/common';
import { RoutesService } from 'src/routes/routes.service';
import { UsersService } from 'src/users/users.service';
import { TrainRepository } from './train.repository';
import { AddTrainDto } from './dto/addTrain.dto';
import { TrainFrequenciesService } from 'src/train-frequencies/train-frequencies.service';
import { Train } from './trains.entity';
import { WeekDays } from './weekdays.enum';
import { CarriagesService } from 'src/carriages/carriages.service';
import { SeatsService } from 'src/seats/seats.service';

@Injectable()
export class TrainsService {
  constructor(
    private trainsRepository: TrainRepository,
    private userService: UsersService,
    private routesService: RoutesService,
    private carriagesService: CarriagesService,
    private seatsService: SeatsService,
    private trainFrequenciesService: TrainFrequenciesService,
  ) {}

  async getTrainByNumber(trainNumber: number) {
    const promises: Promise<any>[] = [
      this.trainsRepository.findOne(trainNumber),
      this.trainFrequenciesService.getFrequenciesByTrainNumber(trainNumber),
    ];
    const [trainInfo, frequencies] = await Promise.all(promises);
    return { ...trainInfo, frequencies };
  }

  async getTrainsFilteredByDateAndFreeSeats(
    start: string,
    end: string,
    date: Date,
  ) {
    const trains = await this.getTrainsFilteredByDate(start, end, date);
    return this.getTrainsFilteredByFreeSeats(trains);
  }

  async getTrainsFilteredByFreeSeats(trains: Train[]) {
    const trainNumbers = trains.map((train) => train.number);
    const trainsByDate = await this.carriagesService.getTrainsWithFreeSeats(
      trainNumbers,
    );
    return trains.filter((train) => trainsByDate.includes(train.number));
  }

  async getTrainsFilteredByDate(start: string, end: string, date: Date) {
    const trains = await this.getTrainsByTwoStationsWithFrequencies(start, end);
    const { isOdd, dayTitle } = this._parseDate(date);
    const desired = [isOdd ? 'ODD' : 'EVEN', dayTitle, 'DAILY'];
    return trains.filter((train) =>
      train.frequency.some((f) => desired.includes(f)),
    );
  }

  private _parseDate(date: Date) {
    const monthDay = date.getDate();
    const weekDay = date.getDay();
    const isOdd = Boolean(monthDay % 2);
    const dayTitle = WeekDays[weekDay];
    return { isOdd, dayTitle };
  }

  async getTrainsByTwoStationsWithFrequencies(start: string, end: string) {
    const trains = await this.getTrainsByTwoStations(start, end);
    return this.getFrequenciesForTrains(trains);
  }

  private async getTrainsByTwoStations(start: string, end: string) {
    const routeIDs = await this.routesService.getRoutesByStations(start, end);
    return this.trainsRepository.findTrainsByRoutes(routeIDs);
  }

  async getTrainsTimetableWithFrequencies(stationTitle: string) {
    const trains = await this.getTrainsTimetableForStation(stationTitle);
    return this.getFrequenciesForTrains(trains);
  }

  private async getTrainsTimetableForStation(stationTitle: string) {
    const routeIDs = await this.routesService.getRoutesPassingThroughStation(
      stationTitle,
    );
    if (!routeIDs.length)
      throw new NotFoundException(`Trains for ${stationTitle} not found!`);
    return this.trainsRepository.findTrainsByRoutes(routeIDs);
  }

  private async getFrequenciesForTrains(trains: Train[]) {
    const promises = trains.map((train) =>
      this.trainFrequenciesService.getFrequenciesByTrainNumber(train.number),
    );
    const frequencies = await Promise.all(promises);
    return trains.map((train, i) => ({ ...train, frequency: frequencies[i] }));
  }

  async addTrain(trainData: AddTrainDto) {
    const { getByEmail } = this.userService;
    const toPromise = getByEmail.bind(this.userService);
    const promises: Promise<any>[] = [
      trainData.lead,
      trainData.machenist,
      trainData.machenistAssistant,
    ].map(toPromise);
    promises.push(this.routesService.getRouteById(trainData.route));
    try {
      const [lead, machenist, machenistAssistant, route] = await Promise.all(
        promises,
      );
      const newTrain = this.trainsRepository.create({
        ...trainData,
        lead,
        machenist,
        machenistAssistant,
        route,
      });
      await this.trainsRepository.save(newTrain);
      return newTrain;
    } catch (err) {
      throw err;
    }
  }
}
