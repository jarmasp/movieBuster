import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../users/repositories/user.repository';
import { OrderDetails } from '../order-details/entities/order-details.entity';
import { SubOrderInfo } from '../order-details/dto/order-details.dto';
import { Movie } from '../movies/entities/movie.entity';
import { OrderDetailsService } from '../order-details/order-details.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly userRepository: UserRepository,
    private readonly orderDetailsService: OrderDetailsService,
    private readonly emailService: EmailService,
  ) {}

  async buyMovie(userId: string, order: Array<SubOrderInfo>): Promise<Order> {
    const res = order
      .map((suborder) => suborder.movieId)
      .every((id, i, a) => a.indexOf(id) === a.lastIndexOf(id));

    if (!res) {
      throw new BadRequestException('every movie Id must be unique');
    }

    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const movies = new Array<Movie>();

    for (const suborder of order) {
      const res = await this.orderDetailsService.validateSubOrder(suborder);
      movies.push(res);
    }

    const subordersInfo = movies.map((movie, i) => ({
      movie,
      quantity: order[i].quantity,
    }));

    const suborders = new Array<OrderDetails>();

    for (const suborder of subordersInfo) {
      const res = await this.orderDetailsService.makeSubOrder(
        suborder.movie,
        suborder.quantity,
      );
      suborders.push(res);
    }

    const total = suborders
      .map((suborder) => suborder.subTotal)
      .reduce((a, b) => a + b);

    const movieOrder = await this.orderRepository.save({
      user,
      details: suborders,
      total,
    });

    this.emailService.send(user.email, movieOrder, 'order');

    return movieOrder;
  }
}
