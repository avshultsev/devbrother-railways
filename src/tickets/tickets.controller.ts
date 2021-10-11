import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/request-with-user.interface';
import { DateTransformPipe } from 'src/trains/pipes/date-transform.pipe';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketInterceptor } from './interceptors/ticket.interceptor';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllTickets(@Req() req: RequestWithUser) {
    return this.ticketsService.getAllTickets(req.user);
  }

  @Post('/book')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TicketInterceptor)
  @UsePipes(DateTransformPipe, new ValidationPipe({ transform: true }))
  bookTicket(@Body() payload: CreateTicketDto, @Req() req: RequestWithUser) {
    return this.ticketsService.createTicket(payload, req.user);
  }
}
