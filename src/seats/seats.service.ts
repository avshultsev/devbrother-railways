import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarriagesService } from 'src/carriages/carriages.service';
import { Repository } from 'typeorm';
import { AddSeatDto } from './dto/add-seat.dto';
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

  async addSeat(payload: AddSeatDto) {
    const carriage = await this.carriageService.getCarriage(
      payload.trainNumber,
      payload.carriageNumber,
    );
    const newSeat = this.seatsRepository.create({
      carriage,
      number: payload.seatNumber,
    });
    await this.seatsRepository.save(newSeat);
    return newSeat;
  }
}
