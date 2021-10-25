import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('The Users Service', () => {
  let usersService: UsersService;
  let findOne: jest.Mock;

  beforeEach(async () => {
    findOne = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: { findOne },
        },
      ],
    }).compile();
    usersService = module.get(UsersService);
  });

  // getByEmail
  describe('when getting a user by email', () => {
    describe('and the user is matched', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        findOne.mockReturnValue(Promise.resolve(user));
      });
      it('should return a user', async () => {
        const fetchedUser = await usersService.getByEmail('test@test.com');
        expect(fetchedUser).toEqual(user);
      });
    });

    describe('and the user is not matched', () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      });
      it('should raise an exception', async () => {
        await expect(
          usersService.getByEmail('test@test.com'),
        ).rejects.toThrow();
      });
    });
  });

  // getById
  describe('when getting a user by ID', () => {
    describe('and the user was found', () => {
      let user: User;
      let id: string;
      beforeEach(() => {
        user = new User();
        id = '1';
        findOne.mockReturnValue(Promise.resolve(user));
      });
      it('should return a user', async () => {
        const fetchedUser = await usersService.getById(id);
        expect(fetchedUser).toBe(user);
      });
    });

    describe('and the user was not found', () => {
      let id: string;
      beforeEach(() => {
        id = 'notExistingID';
        findOne.mockReturnValue(false);
      });
      it('should return a falsy value', async () => {
        const result = await usersService.getById(id);
        expect(result).toBeFalsy();
      });
    });
  });

  // createUser
  // changeRole
  // deleteUser
});
