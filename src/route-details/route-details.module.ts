import { Module } from '@nestjs/common';
import { RouteDetailsController } from './route-details.controller';
import { RouteDetailsService } from './route-details.service';

@Module({
  controllers: [RouteDetailsController],
  providers: [RouteDetailsService],
})
export class RouteDetailsModule {}
