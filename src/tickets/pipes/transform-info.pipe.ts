import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TransformTicketInfoPipe implements PipeTransform {
  transform(value: { train: string; carriage: string; seat: string }) {
    const fields = ['train', 'carriage', 'seat'];
    const converted = fields.map((field) => Number(value[field]));
    const hasNaN = converted.some(Number.isNaN);
    if (hasNaN)
      throw new BadRequestException(
        'Train, carriage and seat must be numberic values!',
      );
    const convertedObj = {};
    fields.forEach((field, index) => (convertedObj[field] = converted[index]));
    return { ...value, ...convertedObj };
  }
}
