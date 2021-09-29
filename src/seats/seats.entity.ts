import { Carriage } from 'src/carriages/carriages.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Carriage, { eager: true })
  carriage: Carriage;

  @Column()
  number: number;

  @Column({ nullable: true })
  ticket: string; // temporary string
}
