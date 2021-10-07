import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DateTransformPipe implements PipeTransform {
  transform(value: string): Date {
    const date = new Date(value);
    if (!date.getDate()) throw new BadRequestException('Invalid date!');
    return date;
  }
}
