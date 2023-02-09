import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { DataSource } from 'typeorm';

describe('UserRepository', () => {
  let userRepo: UserRepository;
  const dataSource = {
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    userRepo = module.get<UserRepository>(UserRepository);
  });

  describe('findUserById', () => {
    it('should return a user found based on id', async () => {
      const mockUser = { name: 'name', lastname: 'lastname' };
      userRepo.findOne = jest.fn().mockResolvedValue(mockUser);

      const user = await userRepo.findUserById('userId');

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { userId: 'userId' },
        select: ['name', 'lastname', 'email', 'createdAt', 'updatedAt', 'role'],
      });
      expect(user).toBe(mockUser);
    });

    it('should throw a not found exception when the user is not found', () => {
      userRepo.findOne = jest.fn().mockResolvedValue(null);

      expect(userRepo.findUserById('userId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [{ name: 'name', lastname: 'lastname' }];
      userRepo.find = jest.fn().mockResolvedValue(mockUsers);
    });
  });

  describe('createUser', () => {
    const mockCreateUserDto: CreateUserDto = {
      name: 'name',
      lastname: 'lastname',
      email: 'email',
      password: 'pass',
    };

    it('should return the created user', async () => {
      userRepo.findUserByEmail = jest.fn().mockResolvedValue(null);
      userRepo.save = jest.fn().mockResolvedValue('user');

      const user = await userRepo.createUser(mockCreateUserDto);
      expect(user).toBe('user');
      expect(userRepo.save).toHaveBeenCalledWith({
        ...mockCreateUserDto,
      });
    });

    it('should throw a conflict exception', () => {
      userRepo.findUserByEmail = jest.fn().mockResolvedValue('user');

      expect(userRepo.createUser(mockCreateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateUser', () => {
    const mockUpdateUserDto = {
      name: 'name',
      lastname: 'lastname',
      email: 'email',
    };

    it('should return updated user', async () => {
      const mockUser = { name: 'name', lastname: 'lastname' };

      userRepo.findOne = jest
        .fn()
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);
      userRepo.save = jest.fn().mockResolvedValue('updated user');

      const user = await userRepo.updateUser('userId', mockUpdateUserDto);

      expect(user).toBe('updated user');
      expect(userRepo.save).toHaveBeenCalledWith({
        ...mockUser,
        ...mockUpdateUserDto,
      });
      expect(userRepo.findOne).toHaveBeenCalledTimes(2);
    });

    it('should throw a not found exception when the user is not found', () => {
      userRepo.findOne = jest.fn().mockResolvedValue(null);

      expect(userRepo.updateUser('userId', mockUpdateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('shoud throw a conflict exception if the new email is already in use', () => {
      userRepo.findOne = jest
        .fn()
        .mockResolvedValueOnce('user')
        .mockResolvedValueOnce('user');

      userRepo.save = jest.fn();

      expect(userRepo.updateUser('userId', mockUpdateUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(userRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const mockUser = { name: 'name', lastname: 'lastname' };
      userRepo.findOne = jest.fn().mockResolvedValue(mockUser);
      userRepo.delete = jest.fn().mockResolvedValue('deleted user');

      const user = await userRepo.deleteUser('userId');

      expect(user).toBe('User with id userId was delete');
      expect(userRepo.delete).toHaveBeenCalledWith('userId');
    });

    it('should throw a not found exception when the user is not found', () => {
      userRepo.findOne = jest.fn().mockResolvedValue(null);

      expect(userRepo.deleteUser('userId')).rejects.toThrow(NotFoundException);
    });
  });

  it('should throw a not found exception when the user is not found', () => {
    userRepo.findOne = jest.fn().mockResolvedValue(null);

    expect(
      userRepo.changeUserPassword('userId', 'newPassword'),
    ).rejects.toThrow(NotFoundException);
  });
});
