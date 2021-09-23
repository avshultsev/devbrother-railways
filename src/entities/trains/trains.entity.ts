import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { Employee } from '../employees/employees.entity';
import { Weekdays } from './weekdays.enum';
import { TrainTypeEnum } from './train-type.enum';
import { TrainFrequencyEnum } from './train-frequency.enum';
import { Carriage } from '../carriages/carriages.entity';
import { Seat } from '../seats/seats.entity';

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

  @OneToMany(() => Carriage, (carriage) => carriage.train)
  carriages: Carriage[];

  @OneToMany(() => Seat, (seat) => seat.train)
  seats: Seat[];

  @OneToOne(() => Employee, (employee) => employee) // occupation or train must be here
  lead: Employee;

  @Column()
  machenist: Employee;

  @Column()
  machenistAssistant: Employee;
}
