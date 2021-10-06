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
    return this.trainsRepository.find({ where: { number: trainNumber } });
  }

  async getTrainsByTwoStations(start: string, end: string): Promise<any> {
    try {
      const routeIDs = await this.routesService.getRoutesByStations(start, end);
      return this.trainsRepository.findTrainsByRoutes(routeIDs);
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
    return this.trainsRepository.findTrainsByRoutes(routeIDs);
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
