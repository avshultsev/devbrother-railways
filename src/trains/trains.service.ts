import { Injectable, NotFoundException } from '@nestjs/common';
import { RoutesService } from 'src/routes/routes.service';
import { UsersService } from 'src/users/users.service';
import { TrainRepository } from './train.repository';
import { AddTrainDto } from './dto/addTrain.dto';

@Injectable()
export class TrainsService {
  constructor(
    private trainsRepository: TrainRepository,
    private userService: UsersService,
    private routesService: RoutesService,
  ) {}

  async getTrainByNumber(trainNumber: number) {
    const raw = await this.trainsRepository.findTrainWithFrequencies(
      trainNumber,
    );
    if (!raw.length)
      throw new NotFoundException(`Train #${trainNumber} not found!`);
    const frequencies = raw.map(({ frequencyName }) => frequencyName);
    return { train: trainNumber, frequencies };
  }

  async getTrainsByStations(start: string, end: string): Promise<any> {
    try {
      const routeIDs = await this.routesService.getRoutesByStations(start, end);
      return this.trainsRepository.findTrainsByRoutes(routeIDs);
    } catch (err) {
      throw err;
    }
  }

  async getTrainsForStation(stationTitle: string) {
    const routeIds = await this.routesService.getStationRoutes(stationTitle);
    return this.trainsRepository.findTrainsByRoutes(routeIds);
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
