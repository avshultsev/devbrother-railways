import { EntityRepository, Repository } from 'typeorm';
import { RouteDetail } from './routeDetails.entity';

@EntityRepository(RouteDetail)
export class RouteDetailsRepository extends Repository<RouteDetail> {}
