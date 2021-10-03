import { Injectable, NotFoundException } from '@nestjs/common';
import { RoutesService } from 'src/routes/routes.service';
import { UsersService } from 'src/users/users.service';
import { TrainRepository } from './train.repository';
import { AddTrainDto } from './dto/addTrain.dto';
import { StationsService } from 'src/stations/stations.service';
import { Train } from './trains.entity';

@Injectable()
export class TrainsService {
  constructor(
    private trainsRepository: TrainRepository,
    private userService: UsersService,
    private routesService: RoutesService,
    private stationsService: StationsService,
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

  async getTrainsByStations(
    startPoint: string,
    endPoint: string,
  ): Promise<Train[]> {
    const { getStationByName } = this.stationsService;
    const toPromise = getStationByName.bind(this.stationsService);
    const promises = [startPoint, endPoint].map(toPromise);
    try {
      const [departurePoint, arrivalPoint] = await Promise.all(promises);
      const result = await this.trainsRepository.findTrainsByStations(
        departurePoint,
        arrivalPoint,
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  async addTrain(trainData: AddTrainDto) {
    const promises: Promise<any>[] = [
      trainData.lead,
      trainData.machenist,
      trainData.machenistAssistant,
    ].map(this.userService.getByEmail.bind(this.userService));
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
