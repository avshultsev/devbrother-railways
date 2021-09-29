import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CarriagesService } from './carriages.service';
import { AddCarriageDto } from './dto/add-carriage.dto';

@Controller('carriages')
export class CarriagesController {
  constructor(private carriageService: CarriagesService) {}

  @Post('/:train')
  addCarriage(
    @Param('train', ParseIntPipe) train: number,
    @Body('number', ParseIntPipe) number: number,
    @Body() carriageData: AddCarriageDto,
  ) {
    return this.carriageService.addCarriage(train, number, carriageData);
  }
}
