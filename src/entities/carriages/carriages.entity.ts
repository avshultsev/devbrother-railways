import { Column, Entity, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Employee } from '../employees/employees.entity';
import { Train } from '../trains/trains.entity';

enum CarriageTypeEnum {}

@Entity()
export class Carriage {
  @PrimaryColumn()
  number: number;

  @PrimaryColumn()
  @ManyToOne(() => Train, (train) => train.number)
  train: number;

  @Column()
  type: CarriageTypeEnum;

  @OneToOne(() => Employee, (employee) => employee)
  conductor1: Employee;

  @OneToOne(() => Employee, (employee) => employee)
  conductor2: Employee;
}
