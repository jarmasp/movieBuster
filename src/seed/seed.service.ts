import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserRepository } from '../users/repositories/user.repository';
import { Admin } from '../seed/constants/admin.constant';
import { HashHelper } from '../users/services/hash.helper';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashHelper: HashHelper,
  ) {}

  async onModuleInit(): Promise<void> {
    const admin = await this.userRepository.findOne({
      where: { email: Admin.email },
    });

    if (!admin) {
      const hashedPassword = this.hashHelper.hash(Admin.password);
      this.userRepository.save({
        ...Admin,
        password: hashedPassword,
      });
    }
  }
}
