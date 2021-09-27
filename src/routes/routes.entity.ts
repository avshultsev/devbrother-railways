import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Station } from '../stations/stations.entity';

@Entity()
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Station)
  @JoinColumn()
  departurePoint: Station;

  @ManyToOne(() => Station)
  @JoinColumn()
  arrivalPoint: Station;
}
