import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationsModule } from '../stations/stations.module';
import { RouteDetailsController } from './route-details.controller';
import { RouteDetailsRepository } from './route-details.repository';
import { RouteDetailsService } from './route-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([RouteDetailsRepository]), StationsModule],
  controllers: [RouteDetailsController],
  providers: [RouteDetailsService],
  exports: [RouteDetailsService],
})
export class RouteDetailsModule {}
