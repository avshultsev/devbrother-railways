import { Carriage } from 'src/carriages/carriages.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
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
