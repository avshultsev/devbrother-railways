import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '../users/roles.enum';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { mockedConfigService } from '../utils/mocks/config.service';
import { mockedJwtService } from '../utils/mocks/jwt.service';

describe('The Authentication Service', () => {
  let authService: AuthService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
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

  describe('when logging out', () => {
    it('should return a string', () => {
      expect(typeof authService.getLogoutCookie()).toBe('string');
    });
  });
});
