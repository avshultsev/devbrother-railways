import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Route } from '../routes/routes.entity';
import { Station } from '../stations/stations.entity';

@Entity()
export class RouteDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Route, { eager: true })
  @JoinColumn()
  route: Route;

  @ManyToOne(() => Station, { eager: true })
  @JoinColumn()
  wayStation: Station;

  @Column()
  stationOrder: number;

  @Column({ type: 'time without time zone' })
  time: Date;
}
