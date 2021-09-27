import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Roles } from './roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  role?: Roles;

  // @Column()
  // name: string;

  // @Column()
  // surname: string;

  // @Column()
  // fathersname: string;

  // @Column()
  // dateOfBirth: Date;

  // @Column()
  // address: string;

  // @Column()
  // phone: string;
}
