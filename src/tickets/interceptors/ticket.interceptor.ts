import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { TrainsService } from 'src/trains/trains.service';
import { CreateTicketDto } from '../dto/create-ticket.dto';

@Injectable()
export class TicketInterceptor implements NestInterceptor {
  constructor(private trainsService: TrainsService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req: Request = context.switchToHttp().getRequest();
    const { train, ...payload }: CreateTicketDto = req.body;
    const [trains, seatsAndCarriages] = await Promise.all([
      this.trainsService.getTrainsFilteredByDate(
        payload.departureStation,
        payload.arrivalStation,
        new Date(payload.date),
      ),
      this.trainsService.getTrainFreeSeats(train),
    ]);
    const occupiedSeat = !seatsAndCarriages[payload.carriage]?.includes(
      Number(payload.seat),
    );
    const trainObj = trains.find(({ number }) => number === Number(train));
    if (occupiedSeat || !trainObj) {
      throw new BadRequestException(`Payload is not valid!`);
    }
    return next.handle();
  }
}
