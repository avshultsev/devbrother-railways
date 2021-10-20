import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcryptjs from 'bcryptjs';
import { PostgresErrorCodes } from './postgres-error.enum';
import { User } from 'src/users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(signUpData: CreateUserDto): Promise<User> {
    const passwordHash = await bcryptjs.hash(signUpData.password, 10);
    try {
      const user = await this.userService.createUser({
        ...signUpData,
        password: passwordHash,
      });
      return user;
    } catch (err) {
      if (err.code === PostgresErrorCodes.NAME_COLLISION) {
        throw new BadRequestException('User with such email already exists!');
      }
      throw new InternalServerErrorException();
    }
  }

  async signIn(email: string, plainPassword: string): Promise<User> {
    try {
      const user = await this.userService.getByEmail(email);
      const isCorrect = await bcryptjs.compare(plainPassword, user.password);
      if (!isCorrect)
        throw new BadRequestException('Email or password are not valid!');
      user.password = '';
      return user;
    } catch (err) {
      throw new BadRequestException('Email or password are not valid!');
    }
  }

  getCookie(user: User) {
    const { id, email } = user;
    const payload: JwtPayload = { id, email };
    const token = this.jwtService.sign(payload);
    const expiresIn = this.configService.get('JWT_EXPIRATION_TIME');
    return `Authentication=${token}; Max-Age=${expiresIn}; Path=/; HttpOnly`;
  }

  getLogoutCookie() {
    return 'Authentication=; Max-Age=0; Path=/; HttpOnly';
  }
}
