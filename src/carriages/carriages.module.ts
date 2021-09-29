import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainsModule } from 'src/trains/trains.module';
import { UsersModule } from 'src/users/users.module';
import { CarriagesController } from './carriages.controller';
import { Carriage } from './carriages.entity';
import { CarriagesService } from './carriages.service';

@Module({
  imports: [TypeOrmModule.forFeature([Carriage]), UsersModule, TrainsModule],
  controllers: [CarriagesController],
  providers: [CarriagesService],
  exports: [CarriagesService],
})
export class CarriagesModule {}
