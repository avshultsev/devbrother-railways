import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Station {
  @PrimaryGeneratedColumn('uuid')
  stationID: string;

  @Column()
  title: string;
}
