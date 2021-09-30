import { Carriage } from 'src/carriages/carriages.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Carriage, { eager: true })
  @JoinColumn()
  carriage: Carriage;

  @Column()
  number: number;

  @Column({ nullable: true })
  ticket: string; // temporary string
}
