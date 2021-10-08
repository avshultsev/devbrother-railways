import { Injectable } from '@nestjs/common';
import { WeekDays } from './weekdays.enum';

@Injectable()
export class DateParser {
  getTime(now: Date, timeOffset: number) {
    const time = new Date(
      Date.parse(now.toString()) + this.minutesToMilliseconds(timeOffset),
    );
    const [hours, minutes] = time.toTimeString().split(':');
    return `${hours}:${minutes}`;
  }

  minutesToMilliseconds(n: number) {
    return n * 60 * 1000;
  }

  getNowTime(timeStr: string) {
    const [hours, minutes] = timeStr.split(':');
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    return new Date(year, month, day, parseInt(hours), parseInt(minutes));
  }

  parseDate(date: Date) {
    const monthDay = date.getDate();
    const weekDay = date.getDay();
    const isOdd = Boolean(monthDay % 2);
    const dayTitle = WeekDays[weekDay];
    return { isOdd, dayTitle };
  }
}
