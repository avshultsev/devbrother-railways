import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SeatsService } from 'src/seats/seats.service';
import { TrainsService } from 'src/trains/trains.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketState } from './ticket-state.enum';
import { Ticket } from './ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    private trainsService: TrainsService,
    private seatsService: SeatsService,
    private usersService: UsersService,
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
    const ticket = await this.ticketsRepository.save(newTicket);
    await this.seatsService.updateSeatStatus(seat, ticket);
    return ticket;
  }
}
