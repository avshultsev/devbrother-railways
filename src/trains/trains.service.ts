import { Injectable, NotFoundException } from '@nestjs/common';
import { RoutesService } from 'src/routes/routes.service';
import { UsersService } from 'src/users/users.service';
import { TrainRepository } from './train.repository';
import { AddTrainDto } from './dto/addTrain.dto';
import { TrainFrequenciesService } from 'src/train-frequencies/train-frequencies.service';
import { Train } from './trains.entity';

@Injectable()
export class TrainsService {
  constructor(
    private trainsRepository: TrainRepository,
    private userService: UsersService,
    private routesService: RoutesService,
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

  async getTrainsByTwoStations(start: string, end: string): Promise<any> {
    try {
      const routeIDs = await this.routesService.getRoutesByStations(start, end);
      const trains = await this.trainsRepository.findTrainsByRoutes(routeIDs);
      return this.getFrequenciesForTrains(trains);
    } catch (err) {
      throw err;
    }
  }

  async getTrainsTimetableForStation(stationTitle: string) {
    const routeIDs = await this.routesService.getRoutesPassingThroughStation(
      stationTitle,
    );
    if (!routeIDs.length)
      throw new NotFoundException(`Trains for ${stationTitle} not found!`);
    const trains = await this.trainsRepository.findTrainsByRoutes(routeIDs);
    return this.getFrequenciesForTrains(trains);
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
