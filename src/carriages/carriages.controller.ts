import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CarriagesService } from './carriages.service';
import { AddCarriageDto } from './dto/add-carriage.dto';

@Controller('carriages')
export class CarriagesController {
  constructor(private carriageService: CarriagesService) {}

  @Get('/:carriageNumber')
  getCarriage(
    @Query('trainNumber', ParseIntPipe) trainNumber: number,
    @Param('carriageNumber', ParseIntPipe) carriageNumber: number,
  ) {
    return this.carriageService.getCarriage(trainNumber, carriageNumber);
  }

  @Post()
  addCarriage(
    @Query('train', ParseIntPipe) train: number,
    @Body('number', ParseIntPipe) number: number,
    @Body() carriageData: AddCarriageDto,
  ) {
    return this.carriageService.addCarriage(train, number, carriageData);
  }
}
