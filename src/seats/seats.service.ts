import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Carriage } from 'src/carriages/carriages.entity';
import { CarriagesService } from 'src/carriages/carriages.service';
import { Ticket } from 'src/tickets/ticket.entity';
import { Repository } from 'typeorm';
import { Capacity } from './capacity.enum';
import { Seat } from './seats.entity';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private seatsRepository: Repository<Seat>,
    private carriageService: CarriagesService,
  ) {}

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

  async getFreeSeats(carriage: Carriage) {
    return this.seatsRepository.find({ where: { carriage, ticket: null } });
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

    const capacity = Capacity[carriage.type];
    const seatsNum = await this.seatsRepository.count({ where: { carriage } });
    if (seatsNum >= capacity)
      throw new BadRequestException(
        'Unable to add more seats to the carriage of this type!',
      );

    const newSeat = this.seatsRepository.create({
      carriage,
      number: seatNumber,
    });
    await this.seatsRepository.save(newSeat);
    return newSeat;
  }

  async updateSeatStatus(seat: Seat, ticket: Ticket) {
    const { affected } = await this.seatsRepository.update(seat.id, { ticket });
    if (!affected) throw new NotFoundException(`Seat not found!`);
    return { ...seat, ticket };
  }
}
