import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { MoviesModule } from '../movies/movies.module';
import { UserRepository } from '../users/repositories/user.repository';
import { EmailModule } from 'src/email/email.module';
import { OrderDetailsModule } from 'src/order-details/order-detail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    MoviesModule,
    OrderDetailsModule,
    EmailModule,
  ],
  providers: [OrdersService, UserRepository],
  controllers: [OrdersController],
})
export class OrdersModule {}
