import { Station } from 'src/stations/stations.entity';

export interface CreateRouteDto {
  departurePoint: Station;
  arrivalPoint: Station;
}
