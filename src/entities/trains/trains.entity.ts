import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { Employee } from '../employees/employees.entity';
import { Weekdays } from './weekdays.enum';
import { TrainTypeEnum } from './train-type.enum';
import { TrainFrequencyEnum } from './train-frequency.enum';

@Entity()
export class Train {
  @PrimaryColumn()
  number: number;

  @Column()
  type: TrainTypeEnum;

  @Column()
  frequency: TrainFrequencyEnum | Weekdays[];

  @Column()
  route: number;

  @Column()
  departureTime: Date;

  @OneToOne(() => Employee, (employee) => employee) // occupation or train must be here
  lead: Employee;

  @Column()
  machenist: Employee;

  @Column()
  machenistAssistant: Employee;
}
