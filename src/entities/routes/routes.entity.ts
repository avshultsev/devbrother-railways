import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Station } from '../stations/stations.entity';

@Entity()
export class Route {
  @PrimaryGeneratedColumn('uuid')
  routeID: string;

  @Column()
  @ManyToOne(() => Station, (station) => station)
  departurePoint: Station;

  @Column()
  @ManyToOne(() => Station, (station) => station)
  arrivalPoint: Station;
}
