import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesModule } from 'src/routes/routes.module';
import { UsersModule } from 'src/users/users.module';
import { Train } from './trains.entity';
import { TrainsController } from './trains.controller';
import { TrainsService } from './trains.service';

@Module({
  imports: [UsersModule, RoutesModule, TypeOrmModule.forFeature([Train])],
  controllers: [TrainsController],
  providers: [TrainsService],
})
export class TrainsModule {}
