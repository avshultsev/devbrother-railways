import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarriagesService } from 'src/carriages/carriages.service';
import { Repository } from 'typeorm';
import { Seat } from './seats.entity';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private seatsRepository: Repository<Seat>,
    private carriageService: CarriagesService,
  ) {}

  // refactor this to perform query from repository layer JOINs
  async getSeat(
    trainNumber: number,
    carriageNumber: number,
    seatNumber: number,
  ) {
    const carriage = await this.carriageService.getCarriage(
      trainNumber,
      carriageNumber,
    );

    return this.seatsRepository.findOne({
      where: { carriage, number: seatNumber },
    });
  }

  async addSeat(
    trainNumber: number,
    carriageNumber: number,
    seatNumber: number,
  ) {
    const carriage = await this.carriageService.getCarriage(
      trainNumber,
      carriageNumber,
    );
    const newSeat = this.seatsRepository.create({
      carriage,
      number: seatNumber,
    });
    await this.seatsRepository.save(newSeat);
    return newSeat;
  }
}
