import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { CarriagesRepository } from './carriages.repository';
import { AddCarriageDto } from './dto/add-carriage.dto';

@Injectable()
export class CarriagesService {
  constructor(
    private carriageRepository: CarriagesRepository,
    private userService: UsersService,
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

  getCarriagesByTrain(trainNumber: number) {
    return this.carriageRepository.find({ where: { train: trainNumber } });
  }

  getTrainsWithFreeSeats(trainNumbers: number[]) {
    return this.carriageRepository.findTrainsWithFreeSeats(trainNumbers);
  }

  async addCarriage(
    train: number,
    carriageNumber: number,
    carriageData: AddCarriageDto,
  ) {
    const promises: Promise<User>[] = [
      carriageData.conductor1,
      carriageData.conductor2,
    ].map(this.userService.getByEmail.bind(this.userService));
    try {
      const [conductor1, conductor2] = await Promise.all(promises);
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
