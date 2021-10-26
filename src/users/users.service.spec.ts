import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from './roles.enum';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('The Users Service', () => {
  let usersService: UsersService;
  const repoFns = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repoFns,
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
        repoFns.findOne.mockReturnValue(Promise.resolve(user));
      });

      it('should return a user', async () => {
        const fetchedUser = await usersService.getByEmail('test@test.com');
        expect(fetchedUser).toEqual(user);
      });
    });

    describe('and the user is not matched', () => {
      beforeEach(() => {
        repoFns.findOne.mockReturnValue(undefined);
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
        repoFns.findOne.mockReturnValue(Promise.resolve(user));
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
        repoFns.findOne.mockReturnValue(false);
      });

      it('should return a falsy value', async () => {
        const result = await usersService.getById(id);
        expect(result).toBeFalsy();
      });
    });
  });

  // createUser
  describe('when creating a new user', () => {
    let users: User[];
    let dto: CreateUserDto;

    beforeEach(() => {
      users = [];
      dto = {
        email: 'test@test.com',
        password: '123456',
        role: Roles.PASSENGER,
      };
      repoFns.create.mockImplementation((createUserDto: CreateUserDto) => ({
        ...createUserDto,
        id: '1',
      }));
      repoFns.save.mockImplementation((newUser: User) => {
        const exists = Boolean(users.find(({ id }) => id === newUser.id));
        if (exists) throw new Error('User exists!');
        users.push(newUser);
      });
    });

    describe('and this email does not exist', () => {
      it('should return new user', async () => {
        const newUser = await usersService.createUser(dto);
        expect(newUser.id).toEqual('1');
        expect(users).toHaveLength(1);
      });
    });

    describe('and this email already exists', () => {
      it('should throw an error', async () => {
        const fn: () => Promise<void> = usersService.createUser.bind(
          usersService,
          dto,
        );
        await expect(fn().then(fn)).rejects.toThrow();
      });
    });
  });

  // changeRole
  describe('when changing user role', () => {
    let users: User[];
    let id: string;
    let role: Roles;

    beforeEach(() => {
      users = [
        {
          email: 'test@test.com',
          id: '1',
          password: '123456',
          role: Roles.PASSENGER,
        },
      ];
      role = Roles.EMPLOYEE;
      repoFns.update.mockImplementation(
        (id: string, { role }: { role: Roles }) => {
          const user = users.find((user) => user.id === id);
          let affected = 0;
          if (user) {
            user.role = role;
            affected = 1;
          }
          return { affected };
        },
      );
    });

    describe('and user was found', () => {
      it("should change user's role", async () => {
        id = '1';
        const user = users[0];
        await usersService.changeRole(id, { role });
        expect(user).toHaveProperty('role', role);
      });
    });

    describe('and user was not found', () => {
      it('should throw an error', async () => {
        id = 'doesNotExist';
        await expect(usersService.changeRole(id, { role })).rejects.toThrow();
      });
    });
  });

  // deleteUser
  describe('when deleting a user', () => {
    let users: User[];
    let id: string;

    beforeEach(() => {
      users = [
        {
          email: 'test@test.com',
          password: '123456',
          role: Roles.PASSENGER,
          id: '1',
        },
      ];
      id = '1';
      repoFns.delete.mockImplementation((id: string) => {
        const index = users.findIndex((user) => user.id === id);
        const affected = index > -1 ? users.splice(index, 1).length : 0;
        return { affected };
      });
    });

    describe('and the user was found', () => {
      it('should delete the user', async () => {
        await usersService.deleteUser(id);
        expect(users).toHaveLength(0);
      });
    });

    describe('and the user was not found', () => {
      it('should throw an error', async () => {
        const fn: () => Promise<void> = usersService.deleteUser.bind(
          usersService,
          id,
        );
        await expect(fn().then(fn)).rejects.toThrow();
      });
    });
  });
});
