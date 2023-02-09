import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from '../repositories/user.repository';
import { HashHelper } from './hash.helper';
import { DataSource } from 'typeorm';

describe('users service tests', () => {
  let service: UsersService;
  let userRepo: UserRepository;
  let hashHelper: HashHelper;
  const dataSource = {
    createEntityManager: jest.fn(),
  };

  const mockUserRepo = () => ({
    find: jest.fn(),
    findUserByEmail: jest.fn(),
    findOne: jest.fn(),
    findUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    changeUserPassword: jest.fn(),
    save: jest.fn(),
    findRolebyName: jest.fn(),
    changeRole: jest.fn(),
    deleteUser: jest.fn(),
  });

  const mockHashHelper = () => ({
    hash: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useFactory: mockUserRepo,
        },
        {
          provide: HashHelper,
          useFactory: mockHashHelper,
        },
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get<UserRepository>(UserRepository);
    hashHelper = module.get<HashHelper>(HashHelper);
  });

  describe('findAll', () => {
    it('should return list of users', async () => {
      const mockResult = 'some user';

      (userRepo.find as jest.Mock).mockResolvedValue(mockResult);

      const users = await service.findAll();
      expect(users).toBe(mockResult);
    });
  });

  describe('findUserByEmail', () => {
    it('should return a user searche by his email', async () => {
      const mockUser = { name: 'name', lastname: 'lastname' };

      (userRepo.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      const user = await service.findUserByEmail('email');

      expect(userRepo.findUserByEmail).toHaveBeenCalledWith('email');
      expect(user).toBe(mockUser);
    });
  });

  describe('findUserbyId', () => {
    it('should return found user', async () => {
      const mockUser = { name: 'name', lastname: 'lastname' };

      (userRepo.findUserById as jest.Mock).mockResolvedValue(mockUser);

      const user = await service.findUserById('userId');

      expect(userRepo.findUserById).toHaveBeenCalledWith('userId');
      expect(user).toBe(mockUser);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUserDto = {
        name: 'name',
        lastname: 'lastname',
        email: 'email',
        password: 'password',
      };

      (userRepo.createUser as jest.Mock).mockResolvedValue('new user');
      (userRepo.findRolebyName as jest.Mock).mockResolvedValue('client');
      (hashHelper.hash as jest.Mock).mockReturnValue('hashed password');

      const user = await service.createUser(mockUserDto);

      // expect(userRepo.createUser).toHaveBeenCalledWith(mockUserDto, 'client');
      expect(user).toBe('new user');
    });
  });

  describe('updateUser', () => {
    it('should return an updated user', async () => {
      const mockUpdateUserDto = {
        name: 'name',
        lastname: 'lastname',
        email: 'email',
      };

      (userRepo.updateUser as jest.Mock).mockResolvedValue('updated user');

      const user = await service.updateUser('userId', mockUpdateUserDto);

      expect(userRepo.updateUser).toHaveBeenCalledWith(
        'userId',
        mockUpdateUserDto,
      );
      expect(user).toBe('updated user');
    });
  });

  describe('changePassword', () => {
    it('should return a user with new password', async () => {
      const mockHashedPassword = 'hashed password';
      (hashHelper.hash as jest.Mock).mockReturnValue(mockHashedPassword);

      service.changePassword('userId', 'password');

      expect(userRepo.changeUserPassword).toHaveBeenCalledWith(
        'userId',
        mockHashedPassword,
      );
    });
  });
});
