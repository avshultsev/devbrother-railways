import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SeatsService } from 'src/seats/seats.service';
import { Seat } from 'src/seats/seats.entity';
import { User } from 'src/users/user.entity';
import { Connection, Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketState } from './ticket-state.enum';
import { Ticket } from './ticket.entity';
import { TrainsService } from 'src/trains/trains.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    private connection: Connection,
    private seatsService: SeatsService,
    private trainsService: TrainsService,
  ) {}

  getAllTickets(passenger: User) {
    return this.ticketsRepository.find({ where: { passenger } });
  }

  async createTicket(payload: CreateTicketDto, user: User) {
    await this.validateTicket(payload);
    const { train, carriage, seat: seatNumber } = payload;
    const seat = await this.seatsService.getSeat(train, carriage, seatNumber);
    const newTicket = this.ticketsRepository.create({
      seat,
      passenger: user,
      name: payload.name,
      surname: payload.surname,
      arrivalPoint: payload.arrivalStation,
      departurePoint: payload.departureStation,
      departureDate: payload.date,
      state: TicketState.BOOKED,
      timestamp: new Date(Date.now()),
    });
    return this.runSeatAndTicketTransaction(newTicket, seat);
  }

  private async runSeatAndTicketTransaction(newTicket: Ticket, seat: Seat) {
    const queryRunner = this.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const ticket = await queryRunner.manager.save(newTicket);
      await queryRunner.manager.update(Seat, seat.id, {
        ticket,
      });
      await queryRunner.commitTransaction();
      return ticket;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }

  private async validateTicket(payload: CreateTicketDto) {
    const [trains, seatsAndCarriages] = await Promise.all([
      this.trainsService.getTrainsFilteredByDate(
        payload.departureStation,
        payload.arrivalStation,
        new Date(payload.date),
      ),
      this.trainsService.getTrainFreeSeats(payload.train),
    ]);
    const occupiedSeat = !seatsAndCarriages[payload.carriage]?.includes(
      payload.seat,
    );
    const trainObj = trains.find(({ number }) => number === payload.train);
    if (occupiedSeat || !trainObj) {
      throw new BadRequestException('Payload is not valid!');
    }
  }
}
