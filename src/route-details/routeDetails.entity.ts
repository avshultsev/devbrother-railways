import { Column, PrimaryColumn } from 'typeorm';
import { Route } from '../routes/routes.entity';
import { Station } from '../stations/stations.entity';

export class RouteDetail {
  @PrimaryColumn()
  routeID: Route;

  @PrimaryColumn()
  wayStation: Station;

  @PrimaryColumn()
  stationOrder: number;

  @Column()
  time: Date;
}
