import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

interface Dateful {
  date: string;
}

@Injectable()
export class DateTransformPipe implements PipeTransform {
  transform<T extends Dateful>(value: T) {
    const { date: dateStr } = value;
    const date = new Date(dateStr);
    if (!date.getDate()) throw new BadRequestException('Invalid date!');
    return { ...value, date };
  }
}
