import { Module } from '@nestjs/common';
import { CarriagesController } from './carriages.controller';
import { CarriagesService } from './carriages.service';

@Module({
  controllers: [CarriagesController],
  providers: [CarriagesService],
})
export class CarriagesModule {}
