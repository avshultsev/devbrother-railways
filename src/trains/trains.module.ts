import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesModule } from '../routes/routes.module';
import { UsersModule } from '../users/users.module';
import { TrainsController } from './trains.controller';
import { TrainsService } from './trains.service';
import { TrainRepository } from './train.repository';
import { TrainFrequenciesModule } from '../train-frequencies/train-frequencies.module';
import { CarriagesModule } from '../carriages/carriages.module';
import { DateParser } from './date-parser.service';

@Module({
  imports: [
    UsersModule,
    RoutesModule,
    TrainFrequenciesModule,
    CarriagesModule,
    TypeOrmModule.forFeature([TrainRepository]),
  ],
  controllers: [TrainsController],
  providers: [TrainsService, DateParser],
  exports: [TrainsService],
})
export class TrainsModule {}
