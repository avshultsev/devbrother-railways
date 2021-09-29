import { Controller } from '@nestjs/common';
import { CarriagesService } from './carriages.service';

@Controller('carriages')
export class CarriagesController {
  constructor(private carriageService: CarriagesService) {}
}
