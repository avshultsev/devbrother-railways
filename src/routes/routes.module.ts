import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteDetailsModule } from '../route-details/route-details.module';
import { StationsModule } from '../stations/stations.module';
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
  exports: [RoutesService],
})
export class RoutesModule {}
