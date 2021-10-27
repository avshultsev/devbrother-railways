import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '../users/roles.enum';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { PostgresErrorCodes } from './postgres-error.enum';
import { UsersService } from '../users/users.service';
import { mockedConfigService } from '../utils/mocks/config.service';
import { mockedJwtService } from '../utils/mocks/jwt.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

describe('The Authentication Service', () => {
  let authService: AuthService;
  let createUser: jest.Mock;
  let getByEmail: jest.Mock;

  beforeEach(async () => {
    createUser = jest.fn();
    getByEmail = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: { createUser, getByEmail },
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
  });

  // getCookie
  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const mockUser: User = {
        email: 'test@test.com',
        id: '1',
        password: 'password',
        role: Roles.PASSENGER,
      };
      const cookie = authService.getCookie(mockUser);
      expect(typeof cookie).toBe('string');
    });
  });

  // getLogoutCookie
  describe('when logging out', () => {
    it('should return a string', () => {
      expect(typeof authService.getLogoutCookie()).toBe('string');
    });
  });

  // signUp
  describe('when signing up', () => {
    let signUpData: CreateUserDto;
    let id: string;
    let user: User;

    beforeEach(() => {
      signUpData = {
        email: 'test@test.com',
        password: '123456',
        role: Roles.PASSENGER,
      };
      id = '1';
      user = {
        ...signUpData,
        id,
      };
    });

    describe('and there is no user with this email', () => {
      beforeEach(() => {
        createUser.mockReturnValue(Promise.resolve(user));
      });

      it('should return user', async () => {
        await expect(authService.signUp(signUpData)).resolves.toEqual(user);
      });
    });

    describe('and there is a user with this email', () => {
      beforeEach(() => {
        createUser.mockImplementationOnce(() => {
          interface ErrorWithCode extends Error {
            code?: string;
          }
          const err: ErrorWithCode = new Error();
          err.code = PostgresErrorCodes.NAME_COLLISION;
          throw err;
        });
      });

      it('should throw an error', async () => {
        await expect(authService.signUp(signUpData)).rejects.toThrowError(
          BadRequestException,
        );
      });
    });
  });

  // signIn
  describe('when signing in', () => {
    let email: string;
    let plainPassword: string;
    let passwordHash: string;
    let user: User;

    beforeEach(() => {
      email = 'test@test.com';
      plainPassword = '123456';
    });

    describe('and creds are valid', () => {
      beforeEach(() => {
        getByEmail.mockImplementation(async (email: string) => {
          passwordHash = await bcryptjs.hash(plainPassword, 10);
          user = {
            email,
            password: passwordHash,
            id: '1',
            role: Roles.PASSENGER,
          };
          return user;
        });
      });

      it('should return a user', async () => {
        const fetchedUser = await authService.signIn(email, plainPassword);
        expect(fetchedUser).toBe(user);
      });
    });

    describe('and creds are not valid', () => {
      beforeEach(() => {
        plainPassword = 'invalidPassword';
        user = {
          email,
          password: passwordHash,
          id: '1',
          role: Roles.PASSENGER,
        };
        getByEmail.mockReturnValue(user);
      });

      it('should throw an error', async () => {
        await expect(
          authService.signIn(email, plainPassword),
        ).rejects.toThrow();
      });
    });
  });
});
