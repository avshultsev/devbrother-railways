import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesModule } from 'src/routes/routes.module';
import { UsersModule } from 'src/users/users.module';
import { TrainsController } from './trains.controller';
import { TrainsService } from './trains.service';
import { TrainRepository } from './train.repository';
import { StationsModule } from 'src/stations/stations.module';

@Module({
  imports: [
    UsersModule,
    RoutesModule,
    StationsModule,
    TypeOrmModule.forFeature([TrainRepository]),
  ],
  controllers: [TrainsController],
  providers: [TrainsService],
  exports: [TrainsService],
})
export class TrainsModule {}
