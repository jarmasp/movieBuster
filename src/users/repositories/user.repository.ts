import { DataSource, Repository, UpdateResult } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangeRoleDto } from '../dto/change-role.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.findOne({
      where: { userId: userId },
      select: ['name', 'lastname', 'email', 'createdAt', 'updatedAt', 'role'],
    });

    if (!user) throw new NotFoundException('user not found');

    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.findOne({ where: { email: email } });
  }

  async getUsers(): Promise<Array<User>> {
    return this.find({
      select: ['name', 'lastname', 'email', 'createdAt', 'updatedAt'],
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findUserByEmail(createUserDto.email);

    if (user) throw new ConflictException('email is already registered');

    return this.save({ ...createUserDto });
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findOne({ where: { userId: userId } });

    if (!user) throw new NotFoundException('user not found');

    if (updateUserDto.email) {
      const res = await this.findOne({ where: { email: updateUserDto.email } });

      if (res) {
        throw new ConflictException('email is already registered');
      }
    }

    return this.save({ ...user, ...updateUserDto });
  }

  async findRolebyName(roleName: string): Promise<User> {
    return this.findOne({ where: { name: roleName } });
  }

  async changeRole(
    userId: string,
    changeRoleDto: ChangeRoleDto,
  ): Promise<User> {
    const user = await this.findOne({ where: { userId: userId } });

    if (!user) throw new NotFoundException('user not found');

    return this.save({ ...user, ...changeRoleDto });
  }

  async deleteUser(userId: string): Promise<string> {
    const user = await this.findOne({
      where: { userId: userId },
    });

    if (!user) throw new NotFoundException('user not found');

    return this.delete(userId) && `User with id ${userId} was delete`;
  }

  async changeUserPassword(
    userId: string,
    newPassword: string,
  ): Promise<UpdateResult> {
    await this.findUserById(userId);

    return this.update(userId, { password: newPassword });
  }
}
