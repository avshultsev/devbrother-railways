import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsNumber()
  train: number;

  @IsNotEmpty()
  @IsNumber()
  carriage: number;

  @IsNotEmpty()
  @IsNumber()
  seat: number;

  @IsNotEmpty()
  @IsString()
  departureStation: string;

  @IsNotEmpty()
  @IsString()
  arrivalStation: string;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  surname: string;
  // documentType: DocumentTypeEnum;
  // documentSerialNumber: string;
}
