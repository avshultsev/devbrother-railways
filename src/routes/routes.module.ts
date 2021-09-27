import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesController } from './routes.controller';
import { RoutesRepository } from './routes.repository';
import { RoutesService } from './routes.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoutesRepository])],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}
