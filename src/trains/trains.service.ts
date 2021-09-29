import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoutesService } from 'src/routes/routes.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { AddTrainDto } from './dto/addTrain.dto';
import { Train } from './trains.entity';

@Injectable()
export class TrainsService {
  constructor(
    @InjectRepository(Train)
    private trainsRepository: Repository<Train>,
    private userService: UsersService,
    private routesService: RoutesService,
  ) {}

  async addTrain(trainData: AddTrainDto) {
    const promises: Promise<any>[] = [
      trainData.lead,
      trainData.machenist,
      trainData.machenistAssistant,
    ].map((email: string) => this.userService.getByEmail(email));
    promises.push(this.routesService.getRouteById(trainData.route));
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
  }
}
