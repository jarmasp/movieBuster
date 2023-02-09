import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UsersModule } from '../users/users.module';
import { UserRepository } from '../users/repositories/user.repository';

@Module({
  imports: [UsersModule],
  providers: [SeedService, UserRepository],
})
export class SeedModule {}
