import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteDetailsModule } from 'src/route-details/route-details.module';
import { StationsModule } from 'src/stations/stations.module';
import { RoutesController } from './routes.controller';
import { RoutesRepository } from './routes.repository';
import { RoutesService } from './routes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoutesRepository]),
    StationsModule,
    RouteDetailsModule,
  ],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}
