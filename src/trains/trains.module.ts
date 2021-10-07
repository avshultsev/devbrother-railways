import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesModule } from 'src/routes/routes.module';
import { UsersModule } from 'src/users/users.module';
import { TrainsController } from './trains.controller';
import { TrainsService } from './trains.service';
import { TrainRepository } from './train.repository';
import { TrainFrequenciesModule } from 'src/train-frequencies/train-frequencies.module';
import { CarriagesModule } from 'src/carriages/carriages.module';
import { SeatsModule } from 'src/seats/seats.module';

@Module({
  imports: [
    UsersModule,
    RoutesModule,
    TrainFrequenciesModule,
    CarriagesModule,
    SeatsModule,
    TypeOrmModule.forFeature([TrainRepository]),
  ],
  controllers: [TrainsController],
  providers: [TrainsService],
  exports: [TrainsService],
})
export class TrainsModule {}
