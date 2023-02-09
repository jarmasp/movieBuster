import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { HashHelper } from './hash.helper';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangeRoleDto } from '../dto/change-role.dto';
import { UpdateResult } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashHelper: HashHelper,
  ) {}

  findAll(): Promise<Array<User>> {
    return this.userRepository.find();
  }

  findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findUserByEmail(email);
  }

  findUserById(userId: string): Promise<User> {
    return this.userRepository.findUserById(userId);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    createUserDto.password = this.hashHelper.hash(password);

    return this.userRepository.createUser(createUserDto);
  }

  updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userRepository.updateUser(userId, updateUserDto);
  }

  async changeRole(
    userId: string,
    changeRoleDto: ChangeRoleDto,
  ): Promise<User> {
    changeRoleDto.role = changeRoleDto.role.toLowerCase();
    if (changeRoleDto.role !== 'client' && changeRoleDto.role !== 'admin') {
      throw new NotFoundException('role not found');
    }

    return this.userRepository.changeRole(userId, changeRoleDto);
  }

  async deleteUser(userId: string) {
    return this.userRepository.deleteUser(userId);
  }

  async changePassword(
    userId: string,
    password: string,
  ): Promise<UpdateResult> {
    const newPassword = this.hashHelper.hash(password);

    return this.userRepository.changeUserPassword(userId, newPassword);
  }
}
