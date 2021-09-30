import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrainsService } from 'src/trains/trains.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Carriage } from './carriages.entity';
import { AddCarriageDto } from './dto/add-carriage.dto';

@Injectable()
export class CarriagesService {
  constructor(
    @InjectRepository(Carriage)
    private carriageRepository: Repository<Carriage>,
    private userService: UsersService,
    private trainsService: TrainsService,
  ) {}

  async getCarriage(trainNumber: number, carriageNumber: number) {
    const carriage = await this.carriageRepository.findOne({
      where: { train: trainNumber, number: carriageNumber },
    });
    if (!carriage)
      throw new NotFoundException(
        `Carriage #${carriageNumber} in train #${trainNumber} not found!`,
      );
    return carriage;
  }

  async addCarriage(
    train: number,
    carriageNumber: number,
    carriageData: AddCarriageDto,
  ) {
    const promises: Promise<any>[] = [
      carriageData.conductor1,
      carriageData.conductor2,
    ].map(this.userService.getByEmail.bind(this.userService));
    promises.push(this.trainsService.getTrainByNumber(train));
    try {
      const [conductor1, conductor2, train] = await Promise.all(promises);
      const newCarriage = this.carriageRepository.create({
        ...carriageData,
        number: carriageNumber,
        train,
        conductor1,
        conductor2,
      });
      await this.carriageRepository.save(newCarriage);
      return newCarriage;
    } catch (err) {
      throw err;
    }
  }
}
