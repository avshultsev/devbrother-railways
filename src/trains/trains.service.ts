import { Injectable, NotFoundException } from '@nestjs/common';
import { RoutesService } from 'src/routes/routes.service';
import { UsersService } from 'src/users/users.service';
import { TrainRepository } from './train.repository';
import { AddTrainDto } from './dto/addTrain.dto';
import { TrainFrequenciesService } from 'src/train-frequencies/train-frequencies.service';
import { Train } from './trains.entity';
import { RouteDetail } from 'src/route-details/routeDetails.entity';
import { DateParser } from './date-parser.service';
import { CarriagesService } from 'src/carriages/carriages.service';

@Injectable()
export class TrainsService {
  constructor(
    private trainsRepository: TrainRepository,
    private userService: UsersService,
    private routesService: RoutesService,
    private carriagesService: CarriagesService,
    private dateParser: DateParser,
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
    const { isOdd, dayTitle } = this.dateParser.parseDate(date);
    const desired = [isOdd ? 'ODD' : 'EVEN', dayTitle, 'DAILY'];
    return trains.filter((train) =>
      train.frequency.some((f) => desired.includes(f)),
    );
  }

  getTrainFreeSeats(train: number) {
    return this.carriagesService.getTrainFreeSeats(train);
  }

  async getTrainTimetable(trainNumber: number) {
    try {
      const train = await this.trainsRepository.findOne({
        where: { number: trainNumber },
      });
      const route = await this.routesService.getFullRouteInfo(train.route);
      const { routeInfo, routeDetails } = route;
      const wayStationsInfo = this.toWayStations(
        routeDetails,
        train.departureTime.toString(),
      );
      const departure = {
        station: routeInfo.departurePoint.title,
        time: this.stringToDate(train.departureTime.toString()),
      };
      const arrival = {
        station: routeInfo.arrivalPoint.title,
        time: this.stringToDate(
          train.departureTime.toString(),
          routeInfo.travelTime,
        ),
      };
      return [departure, ...wayStationsInfo, arrival];
    } catch (err) {
      throw new NotFoundException(`Train #${trainNumber} not found!`);
    }
  }

  private stringToDate(timeStr: string, timeOffset = 0) {
    const now = this.dateParser.getNowTime(timeStr);
    return this.dateParser.getTime(now, timeOffset);
  }

  private toWayStations(routeDetails: RouteDetail[], timeStr: string) {
    const now = this.dateParser.getNowTime(timeStr);
    return routeDetails.map((routeDetail) => ({
      station: routeDetail.wayStation.title,
      time: this.dateParser.getTime(now, routeDetail.timeOffset),
    }));
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
    const trainsWithFreqs = await this.getFrequenciesForTrains(trains);
    const promises = trainsWithFreqs.map((trainWithFreq) =>
      this.getTrainTimetable(trainWithFreq.number),
    );
    const timetables = await Promise.all(promises);
    const stations = timetables.map((timetable) =>
      timetable.find(({ station }) => station === stationTitle),
    );
    return trainsWithFreqs.map((trainWithFreq, index) => ({
      ...trainWithFreq,
      departureTime: stations[index].time,
    }));
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
