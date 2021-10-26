import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeRoleDto } from './dto/change-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });
    if (!user)
      throw new NotFoundException(`User with email ${email} not found!`);
    return user;
  }

  getById(id: string) {
    return this.userRepository.findOne(id);
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser);
    newUser.password = undefined;
    return newUser;
  }

  async changeRole(id: string, payload: ChangeRoleDto) {
    const { role } = payload;
    const { affected } = await this.userRepository.update(id, { role });
    if (!affected) throw new NotFoundException(`User with id ${id} not found!`);
  }

  async deleteUser(id: string) {
    const { affected } = await this.userRepository.delete(id);
    if (!affected) throw new NotFoundException(`User with id ${id} not found!`);
  }
}
