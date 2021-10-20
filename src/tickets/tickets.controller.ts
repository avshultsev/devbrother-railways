import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/request-with-user.interface';
import { DateTransformPipe } from 'src/trains/pipes/date-transform.pipe';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TransformTicketInfoPipe } from './pipes/transform-info.pipe';
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
  @UsePipes(DateTransformPipe, TransformTicketInfoPipe, ValidationPipe)
  bookTicket(@Body() payload: CreateTicketDto, @Req() req: RequestWithUser) {
    return this.ticketsService.createTicket(payload, req.user);
  }
}
