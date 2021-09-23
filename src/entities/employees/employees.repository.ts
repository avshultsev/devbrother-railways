import { Repository } from 'typeorm';
import { Employee } from './employees.entity';

export class EmployeesRepository extends Repository<Employee> {}
