import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Employee {
  @PrimaryColumn()
  passportID: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  fathersName: string;

  @Column()
  address: string;

  @Column()
  phone: string;
}
