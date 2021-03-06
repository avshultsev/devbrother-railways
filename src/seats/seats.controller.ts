import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { SeatsService } from './seats.service';

@Controller('seats')
export class SeatsController {
  constructor(private seatsService: SeatsService) {}

  @Get()
  getSeat(
    @Query('trainNumber', ParseIntPipe) trainNumber: number,
    @Query('carriageNumber', ParseIntPipe) carriageNumber: number,
    @Query('seatNumber', ParseIntPipe) seatNumber: number,
  ) {
    return this.seatsService.getSeat(trainNumber, carriageNumber, seatNumber);
  }

  @Post()
  @UsePipes(ParseIntPipe)
  addSeat(
    @Query('trainNumber') trainNumber: number,
    @Query('carriageNumber') carriageNumber: number,
    @Body('seatNumber') seatNumber: number,
  ) {
    return this.seatsService.addSeat(trainNumber, carriageNumber, seatNumber);
  }
}
