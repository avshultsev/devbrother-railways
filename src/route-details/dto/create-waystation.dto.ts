import { Station } from 'src/stations/stations.entity';

export class CreateWayStationDto {
  wayStation: Station;
  stationOrder: number;
  time: Date;
}
