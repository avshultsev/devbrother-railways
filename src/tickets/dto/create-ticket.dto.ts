import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  train: number;

  @IsNotEmpty()
  carriage: number;

  @IsNotEmpty()
  seat: number;

  @IsNotEmpty()
  departureStation: string;

  @IsNotEmpty()
  arrivalStation: string;

  @IsDate()
  date: Date;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;
  // documentType: DocumentTypeEnum;
  // documentSerialNumber: string;
}
