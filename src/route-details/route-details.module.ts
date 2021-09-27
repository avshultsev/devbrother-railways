import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteDetailsController } from './route-details.controller';
import { RouteDetailsRepository } from './route-details.repository';
import { RouteDetailsService } from './route-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([RouteDetailsRepository])],
  controllers: [RouteDetailsController],
  providers: [RouteDetailsService],
})
export class RouteDetailsModule {}
