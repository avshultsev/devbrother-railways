import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatsModule } from 'src/seats/seats.module';
import { TrainsModule } from 'src/trains/trains.module';
import { UsersModule } from 'src/users/users.module';
import { Ticket } from './ticket.entity';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  imports: [
    TrainsModule,
    SeatsModule,
    UsersModule,
    TypeOrmModule.forFeature([Ticket]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
