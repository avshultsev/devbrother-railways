import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationsModule } from 'src/stations/stations.module';
import { RoutesController } from './routes.controller';
import { RoutesRepository } from './routes.repository';
import { RoutesService } from './routes.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoutesRepository]), StationsModule],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}
