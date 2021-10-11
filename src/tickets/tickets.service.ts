import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SeatsService } from 'src/seats/seats.service';
import { Seat } from 'src/seats/seats.entity';
import { User } from 'src/users/user.entity';
import { Connection, Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketState } from './ticket-state.enum';
import { Ticket } from './ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    private connection: Connection,
    private seatsService: SeatsService,
  ) {}

  getAllTickets(passenger: User) {
    return this.ticketsRepository.find({ where: { passenger } });
  }

  async createTicket(payload: CreateTicketDto, user: User) {
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
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
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
}
