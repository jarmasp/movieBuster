import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { UsersService } from './services/users.service';
import { HashHelper } from './services/hash.helper';
import { UsersController } from './controllers/users.controller';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { RentedMoviesService } from 'src/users/services/rented-movie.service';
import { Rent } from 'src/rents/entities/rent.entity';
import { LikedMoviesService } from 'src/users/services/liked-movie.service';
import { Order } from 'src/orders/entities/order.entity';
import { BoughtMoviesService } from 'src/users/services/bought-movie.service';
import { User } from './entities/user.entity';
import { MeController } from './controllers/me.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Rent, Order]),
    forwardRef(() => AuthenticationModule),
  ],
  providers: [
    UsersService,
    HashHelper,
    RentedMoviesService,
    LikedMoviesService,
    BoughtMoviesService,
    UserRepository,
  ],
  exports: [UsersService, TypeOrmModule, HashHelper, AuthenticationModule],
  controllers: [UsersController, MeController],
})
export class UsersModule {}
