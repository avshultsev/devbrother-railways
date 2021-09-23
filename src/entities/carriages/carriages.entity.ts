import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Employee } from '../employees/employees.entity';
import { Seat } from '../seats/seats.entity';
import { Train } from '../trains/trains.entity';

enum CarriageTypeEnum {}

@Entity()
export class Carriage {
  @PrimaryColumn()
  number: number;

  @PrimaryColumn()
  @ManyToOne(() => Train, (train) => train.carriages)
  train: number;

  @OneToMany(() => Seat, (seat) => seat.carriage)
  seats: Seat[];

  @Column()
  type: CarriageTypeEnum;

  @OneToOne(() => Employee, (employee) => employee)
  conductor1: Employee;

  @OneToOne(() => Employee, (employee) => employee)
  conductor2: Employee;
}
